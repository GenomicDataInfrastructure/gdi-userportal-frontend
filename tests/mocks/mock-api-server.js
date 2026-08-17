// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

// @ts-check
const http = require("http");
const mockData = require("./discovery.json");

const DEFAULT_PORT = 4010;
const port = Number(process.env.MOCK_API_PORT || DEFAULT_PORT);

const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

// ---------------------------------------------------------------------------
// Async startup — generates a test RSA signing key pair via jose, builds
// GA4GH Passport mock endpoints, then starts listening.
// ---------------------------------------------------------------------------
async function main() {
  const { generateKeyPair, SignJWT, exportJWK } = await import("jose");

  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const publicKeyJwk = await exportJWK(publicKey);
  publicKeyJwk.kid = "test-key-1";
  publicKeyJwk.use = "sig";
  publicKeyJwk.alg = "RS256";
  const jwks = { keys: [publicKeyJwk] };
  const jkuUrl = `http://localhost:${port}/jwks.json`;

  async function createVisaJwt({ datasetId, source, by }) {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const exp = nowSeconds + 365 * 24 * 60 * 60;
    return new SignJWT({
      iss: `http://localhost:${port}`,
      sub: "test-user",
      iat: nowSeconds,
      exp,
      ga4gh_visa_v1: {
        type: "ControlledAccessGrants",
        value: datasetId,
        source,
        by,
        iat: nowSeconds,
        exp,
      },
    })
      .setProtectedHeader({ alg: "RS256", kid: "test-key-1", jku: jkuUrl })
      .sign(privateKey);
  }

  // ---------------------------------------------------------------------------
  // Scenario state — controlled via POST /_test/set-scenario
  // ---------------------------------------------------------------------------
  let currentScenario = "default";

  const visaScenarios = {
    default: [
      await createVisaJwt({ datasetId: "doi:10.1234/ds-001", source: "ckan", by: "REMS" }),
    ],
    multiple: [
      await createVisaJwt({ datasetId: "doi:10.1234/ds-001", source: "ckan", by: "REMS" }),
      await createVisaJwt({ datasetId: "doi:10.1234/ds-002", source: "rems", by: "DAC" }),
    ],
    fallback: [
      await createVisaJwt({ datasetId: "unknown-dataset-id-999", source: "rems", by: "DAC" }),
    ],
    empty: [],
  };

  const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (!req.url || !req.method) return sendJson(res, 400, { message: "Invalid request" });
    if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const { pathname } = requestUrl;

    if (pathname === "/health") return sendJson(res, 200, { status: "ok" });

    // ── Test control ────────────────────────────────────────────────────────
    if (pathname === "/_test/set-scenario" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const { scenario } = JSON.parse(body);
        if (scenario in visaScenarios) {
          currentScenario = scenario;
          return sendJson(res, 200, { ok: true, scenario });
        }
        return sendJson(res, 400, { error: `Unknown scenario: ${scenario}` });
      } catch {
        return sendJson(res, 400, { error: "Invalid JSON body" });
      }
    }

    // ── GA4GH Passport: Keycloak LS-AAI token exchange ──────────────────────
    if (pathname === "/broker/LSAAI/token" && req.method === "GET") {
      return sendJson(res, 200, { access_token: "fake-lsaai-token" });
    }

    // ── GA4GH Passport: LS-AAI userinfo ────────────────────────────────────
    if (pathname === "/userinfo" && req.method === "POST") {
      const visas = visaScenarios[currentScenario] ?? visaScenarios.default;
      return sendJson(res, 200, { ga4gh_passport_v1: visas });
    }

    // ── JWKS ────────────────────────────────────────────────────────────────
    if (pathname === "/jwks.json" && req.method === "GET") {
      return sendJson(res, 200, jwks);
    }

    // ── Discovery API ────────────────────────────────────────────────────────
    if (pathname === "/api/v1/filters" && req.method === "GET") {
      return sendJson(res, 200, mockData.filters);
    }

    const filterValuesMatch = pathname.match(/^\/api\/v1\/filters\/([^/]+)\/values$/);
    if (filterValuesMatch && req.method === "GET") {
      const key = decodeURIComponent(filterValuesMatch[1]);
      return sendJson(res, 200, mockData.filterValuesByKey[key] || []);
    }

    if (pathname === "/api/v1/datasets/search" && req.method === "POST") {
      return sendJson(res, 200, { ...mockData.datasetSearchResponse, facets: mockData.filters });
    }

    const datasetDetailMatch = pathname.match(/^\/api\/v1\/datasets\/([^/]+)$/);
    if (datasetDetailMatch && req.method === "GET") {
      const id = decodeURIComponent(datasetDetailMatch[1]);
      const dataset =
        mockData.datasetDetailsById[id] ||
        mockData.datasetSearchResponse.results.find((item) => item.id === id);
      if (dataset) return sendJson(res, 200, dataset);
      return sendJson(res, 404, { message: "Dataset not found", id });
    }

    const datasetFormatMatch = pathname.match(/^\/api\/v1\/datasets\/([^/]+)\.(rdf|ttl|jsonld)$/);
    if (datasetFormatMatch && req.method === "GET") {
      return sendJson(res, 200, { id: decodeURIComponent(datasetFormatMatch[1]), format: datasetFormatMatch[2] });
    }

    return sendJson(res, 404, { message: "Not found", path: pathname });
  });

  server.listen(port, () => {
    console.log(`Mock API server listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("Mock API server failed to start:", err);
  process.exit(1);
});
