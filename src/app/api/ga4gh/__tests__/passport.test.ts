// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { getToken } from "@/app/api/auth/auth";
import { fetchGa4ghPassport, fetchGa4ghVisas } from "../passport";

jest.mock("@/app/api/auth/auth");
const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockFetch(
  responses: Array<{ ok: boolean; status?: number; body: object }>
): void {
  let callIndex = 0;
  global.fetch = jest.fn((): Promise<Response> => {
    const resp = responses[callIndex++] ?? responses[responses.length - 1];
    return Promise.resolve({
      ok: resp.ok,
      status: resp.status ?? (resp.ok ? 200 : 500),
      statusText: resp.ok ? "OK" : "Internal Server Error",
      json: () => Promise.resolve(resp.body),
    } as Response);
  }) as typeof global.fetch;
}

const KEYCLOAK_TOKEN = "keycloak-access-token";
const LS_AAI_TOKEN = "ls-aai-access-token";
const VISA_JWT = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.sig";
const LS_AAI_USERINFO_URL = "https://login.aai.lifescience-ri.eu/oidc/userinfo";

function makeJwt(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "RS256" })).toString(
    "base64url"
  );
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.signature`;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("fetchGa4ghPassport", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.LS_AAI_USERINFO_URL = LS_AAI_USERINFO_URL;
  });

  afterEach(() => {
    delete process.env.LS_AAI_USERINFO_URL;
  });

  describe("when user is unauthenticated", () => {
    it("returns an empty array without making any HTTP calls", async () => {
      mockedGetToken.mockResolvedValueOnce(null);
      const fetchSpy = jest.spyOn(global, "fetch");

      const result = await fetchGa4ghPassport();

      expect(result).toEqual({ visaJwts: [], passportPresent: false });
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe("Step 1 — Keycloak broker token exchange", () => {
    it("calls the correct broker endpoint with the Keycloak Bearer token", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([
        { ok: true, body: { access_token: LS_AAI_TOKEN } },
        { ok: true, body: { ga4gh_passport_v1: [] } },
      ]);

      await fetchGa4ghPassport();

      const [brokerCall] = (global.fetch as jest.Mock).mock.calls;
      expect(brokerCall[0]).toBe(
        `${process.env.KEYCLOAK_ISSUER_URL}/broker/LSAAI/token`
      );
      expect((brokerCall[1] as RequestInit).method).toBe("GET");
      expect((brokerCall[1] as RequestInit).headers).toMatchObject({
        Authorization: `Bearer ${KEYCLOAK_TOKEN}`,
      });
    });

    it("throws when the broker endpoint returns a non-OK status", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([{ ok: false, status: 401, body: {} }]);

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI token exchange failed: 401"
      );
    });

    it("throws when the broker response contains no access_token", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([{ ok: true, body: {} }]);

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI token exchange returned no access_token"
      );
    });
    it("includes error field from broker JSON body in thrown message", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([{ ok: false, status: 401, body: { error: "invalid_token" } }]);

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI token exchange failed: 401 invalid_token"
      );
    });
  });

  describe("Step 2 — LS-AAI userinfo passport fetch", () => {
    it("calls the userinfo endpoint with the LS-AAI Bearer token", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([
        { ok: true, body: { access_token: LS_AAI_TOKEN } },
        { ok: true, body: { ga4gh_passport_v1: [VISA_JWT] } },
      ]);

      await fetchGa4ghPassport();

      const userinfoCall = (global.fetch as jest.Mock).mock.calls[1];
      expect(userinfoCall[0]).toBe(LS_AAI_USERINFO_URL);
      expect((userinfoCall[1] as RequestInit).method).toBe("POST");
      expect((userinfoCall[1] as RequestInit).headers).toMatchObject({
        Authorization: `Bearer ${LS_AAI_TOKEN}`,
      });
    });

    it("returns the ga4gh_passport_v1 array from the userinfo response", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([
        { ok: true, body: { access_token: LS_AAI_TOKEN } },
        { ok: true, body: { ga4gh_passport_v1: [VISA_JWT] } },
      ]);

      const result = await fetchGa4ghPassport();

      expect(result).toEqual({ visaJwts: [VISA_JWT], passportPresent: true });
    });

    it("returns passportPresent: false and empty visaJwts when userinfo contains no ga4gh_passport_v1", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([
        { ok: true, body: { access_token: LS_AAI_TOKEN } },
        { ok: true, body: { sub: "user123" } },
      ]);
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      const result = await fetchGa4ghPassport();

      expect(result).toEqual({ visaJwts: [], passportPresent: false });
      expect(warnSpy).toHaveBeenCalledWith(
        "[passport] ga4gh_passport_v1 claim absent from LS-AAI userinfo response",
        expect.objectContaining({ sub: "user123" })
      );
      warnSpy.mockRestore();
    });

    it("throws when the userinfo endpoint returns a non-OK status", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([
        { ok: true, body: { access_token: LS_AAI_TOKEN } },
        { ok: false, status: 403, body: {} },
      ]);

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI userinfo request failed: 403"
      );
    });

    it("includes error field from userinfo JSON body in thrown message", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([
        { ok: true, body: { access_token: LS_AAI_TOKEN } },
        { ok: false, status: 401, body: { error: "invalid_token" } },
      ]);

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI userinfo request failed: 401 invalid_token"
      );
    });
  });

  describe("missing required environment variables", () => {
    it("throws when KEYCLOAK_ISSUER_URL is not set", async () => {
      const original = process.env.KEYCLOAK_ISSUER_URL;
      delete process.env.KEYCLOAK_ISSUER_URL;
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "Missing required environment variable: KEYCLOAK_ISSUER_URL"
      );

      process.env.KEYCLOAK_ISSUER_URL = original;
    });

    it("throws when LS_AAI_USERINFO_URL is not set", async () => {
      delete process.env.LS_AAI_USERINFO_URL;
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([{ ok: true, body: { access_token: LS_AAI_TOKEN } }]);

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "Missing required environment variable: LS_AAI_USERINFO_URL"
      );
    });
  });

  describe("full two-step flow", () => {
    it("returns multiple visa JWTs when passport contains several visas", async () => {
      const visa1 = "visa-jwt-1";
      const visa2 = "visa-jwt-2";
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([
        { ok: true, body: { access_token: LS_AAI_TOKEN } },
        { ok: true, body: { ga4gh_passport_v1: [visa1, visa2] } },
      ]);

      const result = await fetchGa4ghPassport();

      expect(result).toEqual({
        visaJwts: [visa1, visa2],
        passportPresent: true,
      });
    });
  });

  describe("network timeouts and unreachable endpoints", () => {
    function makeTimeoutError(): Error {
      const err = new Error("signal timed out");
      err.name = "TimeoutError";
      return err;
    }

    it("throws a sanitized timeout error when the broker endpoint times out", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      jest.spyOn(global, "fetch").mockRejectedValueOnce(makeTimeoutError());

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI broker endpoint timed out"
      );
    });

    it("throws a sanitized error when the broker endpoint is unreachable", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      jest
        .spyOn(global, "fetch")
        .mockRejectedValueOnce(new TypeError("fetch failed"));

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI broker endpoint unreachable"
      );
    });

    it("throws a sanitized timeout error when the userinfo endpoint times out", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      jest
        .spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          json: () => Promise.resolve({ access_token: LS_AAI_TOKEN }),
        } as Response)
        .mockRejectedValueOnce(makeTimeoutError());

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI userinfo endpoint timed out"
      );
    });

    it("throws a sanitized error when the userinfo endpoint is unreachable", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      jest
        .spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          json: () => Promise.resolve({ access_token: LS_AAI_TOKEN }),
        } as Response)
        .mockRejectedValueOnce(new TypeError("fetch failed"));

      await expect(fetchGa4ghPassport()).rejects.toThrow(
        "LS-AAI userinfo endpoint unreachable"
      );
    });

    it("does not expose internal network error details in timeout messages", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      jest.spyOn(global, "fetch").mockRejectedValueOnce(makeTimeoutError());

      let thrownMessage = "";
      try {
        await fetchGa4ghPassport();
      } catch (err) {
        thrownMessage = err instanceof Error ? err.message : String(err);
      }

      // Message must not contain internal stack traces, tokens, or URLs
      expect(thrownMessage).not.toContain("Bearer");
      expect(thrownMessage).not.toContain("keycloak");
      expect(thrownMessage).toBe("LS-AAI broker endpoint timed out");
    });
  });
});

describe("fetchGa4ghVisas", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.LS_AAI_USERINFO_URL = LS_AAI_USERINFO_URL;
  });

  afterEach(() => {
    delete process.env.LS_AAI_USERINFO_URL;
  });

  it("returns no passport when the user is unauthenticated", async () => {
    mockedGetToken.mockResolvedValueOnce(null);

    await expect(fetchGa4ghVisas()).resolves.toEqual({
      visaJwts: [],
      passportPresent: false,
    });
  });

  it("prefers the access-token ga4gh_visas claim", async () => {
    const visaJwts = ["visa-1", "visa-2"];
    const fetchSpy = jest.spyOn(global, "fetch");

    await expect(
      fetchGa4ghVisas(makeJwt({ ga4gh_visas: visaJwts }))
    ).resolves.toEqual({ visaJwts, passportPresent: true });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mockedGetToken).not.toHaveBeenCalled();
  });

  it("falls back to the LS-AAI passport when the claim is absent", async () => {
    mockFetch([
      { ok: true, body: { access_token: LS_AAI_TOKEN } },
      { ok: true, body: { ga4gh_passport_v1: [VISA_JWT] } },
    ]);

    await expect(fetchGa4ghVisas(makeJwt({ sub: "user" }))).resolves.toEqual({
      visaJwts: [VISA_JWT],
      passportPresent: true,
    });
    expect(mockedGetToken).not.toHaveBeenCalled();
  });
});
