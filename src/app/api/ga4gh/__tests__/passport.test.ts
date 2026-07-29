// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { getToken } from "@/app/api/auth/auth";
import { fetchGa4ghPassport } from "../passport";

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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("fetchGa4ghPassport", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("when user is unauthenticated", () => {
    it("returns an empty array without making any HTTP calls", async () => {
      mockedGetToken.mockResolvedValueOnce(null);
      const fetchSpy = jest.spyOn(global, "fetch");

      const result = await fetchGa4ghPassport();

      expect(result).toEqual([]);
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
      const userinfoUrl =
        process.env.LS_AAI_USERINFO_URL ??
        "https://login.aai.lifescience-ri.eu/oidc/userinfo";
      expect(userinfoCall[0]).toBe(userinfoUrl);
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

      expect(result).toEqual([VISA_JWT]);
    });

    it("returns an empty array when userinfo contains no ga4gh_passport_v1", async () => {
      mockedGetToken.mockResolvedValueOnce(KEYCLOAK_TOKEN);
      mockFetch([
        { ok: true, body: { access_token: LS_AAI_TOKEN } },
        { ok: true, body: { sub: "user123" } },
      ]);

      const result = await fetchGa4ghPassport();

      expect(result).toEqual([]);
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

      expect(result).toEqual([visa1, visa2]);
    });
  });
});
