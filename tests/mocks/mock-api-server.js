// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
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

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (!req.url || !req.method) {
    return sendJson(res, 400, { message: "Invalid request" });
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const requestUrl = new URL(
    req.url,
    `http://${req.headers.host || "localhost"}`
  );
  const { pathname } = requestUrl;

  if (pathname === "/health") {
    return sendJson(res, 200, { status: "ok" });
  }

  if (pathname === "/api/v1/filters" && req.method === "GET") {
    return sendJson(res, 200, mockData.filters);
  }

  const filterValuesMatch = pathname.match(
    /^\/api\/v1\/filters\/([^/]+)\/values$/
  );
  if (filterValuesMatch && req.method === "GET") {
    const key = decodeURIComponent(filterValuesMatch[1]);
    const values = mockData.filterValuesByKey[key] || [];
    return sendJson(res, 200, values);
  }

  if (pathname === "/api/v1/datasets/search" && req.method === "POST") {
    return sendJson(res, 200, mockData.datasetSearchResponse);
  }

  const datasetDetailMatch = pathname.match(/^\/api\/v1\/datasets\/([^/]+)$/);
  if (datasetDetailMatch && req.method === "GET") {
    const id = decodeURIComponent(datasetDetailMatch[1]);
    const dataset =
      mockData.datasetDetailsById[id] ||
      mockData.datasetSearchResponse.results.find((item) => item.id === id);

    if (dataset) {
      return sendJson(res, 200, dataset);
    }

    return sendJson(res, 404, { message: "Dataset not found", id });
  }

  const datasetFormatMatch = pathname.match(
    /^\/api\/v1\/datasets\/([^/]+)\.(rdf|ttl|jsonld)$/
  );
  if (datasetFormatMatch && req.method === "GET") {
    const id = decodeURIComponent(datasetFormatMatch[1]);
    const format = datasetFormatMatch[2];
    return sendJson(res, 200, { id, format });
  }

  return sendJson(res, 404, { message: "Not found", path: pathname });
});

server.listen(port, () => {
  console.log(`Mock API server listening on http://localhost:${port}`);
});
