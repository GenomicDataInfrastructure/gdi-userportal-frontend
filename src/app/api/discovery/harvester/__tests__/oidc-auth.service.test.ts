// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { OidcAuthService } from "@/app/api/discovery/harvester/oidc-auth.service";

type EnvSnapshot = {
  tokenUrl?: string;
  clientId?: string;
  clientSecret?: string;
};

const readEnv = (): EnvSnapshot => ({
  tokenUrl: process.env.HARVEST_OIDC_TOKEN_URL,
  clientId: process.env.HARVEST_OIDC_CLIENT_ID,
  clientSecret: process.env.HARVEST_OIDC_CLIENT_SECRET,
});

const applyEnv = (snapshot: EnvSnapshot): void => {
  const { tokenUrl, clientId, clientSecret } = snapshot;
  if (tokenUrl === undefined) delete process.env.HARVEST_OIDC_TOKEN_URL;
  else process.env.HARVEST_OIDC_TOKEN_URL = tokenUrl;
  if (clientId === undefined) delete process.env.HARVEST_OIDC_CLIENT_ID;
  else process.env.HARVEST_OIDC_CLIENT_ID = clientId;
  if (clientSecret === undefined) delete process.env.HARVEST_OIDC_CLIENT_SECRET;
  else process.env.HARVEST_OIDC_CLIENT_SECRET = clientSecret;
};

describe("OidcAuthService", () => {
  const originalEnv = readEnv();
  const originalFetch = global.fetch;
  let fetchMock: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    delete process.env.HARVEST_OIDC_TOKEN_URL;
    delete process.env.HARVEST_OIDC_CLIENT_ID;
    delete process.env.HARVEST_OIDC_CLIENT_SECRET;
    jest.restoreAllMocks();
    fetchMock = jest.fn<typeof fetch>();
    global.fetch = fetchMock;
  });

  afterAll(() => {
    applyEnv(originalEnv);
    global.fetch = originalFetch;
  });

  test("returns empty headers when OIDC is not configured", async () => {
    const service = new OidcAuthService();
    await expect(service.getAuthorizationHeaderIfConfigured()).resolves.toEqual(
      {}
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("throws when OIDC configuration is partial", async () => {
    process.env.HARVEST_OIDC_CLIENT_ID = "client-only";
    const service = new OidcAuthService();

    await expect(service.getAuthorizationHeaderIfConfigured()).rejects.toThrow(
      "Incomplete OIDC configuration for harvesting"
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("retrieves token and returns bearer authorization header", async () => {
    process.env.HARVEST_OIDC_TOKEN_URL = "https://id.example/token";
    process.env.HARVEST_OIDC_CLIENT_ID = "client-id";
    process.env.HARVEST_OIDC_CLIENT_SECRET = "client-secret";

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "token-123", expires_in: 3600 }),
    } as Response);

    const service = new OidcAuthService();
    const headers = await service.getAuthorizationHeaderIfConfigured();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("https://id.example/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials&client_id=client-id&client_secret=client-secret",
    });
    expect(headers).toEqual({ Authorization: "Bearer token-123" });
  });

  test("reuses cached token while it is still valid", async () => {
    process.env.HARVEST_OIDC_TOKEN_URL = "https://id.example/token";
    process.env.HARVEST_OIDC_CLIENT_ID = "client-id";
    process.env.HARVEST_OIDC_CLIENT_SECRET = "client-secret";

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "token-123", expires_in: 3600 }),
    } as Response);

    const service = new OidcAuthService();
    const first = await service.getAuthorizationHeaderIfConfigured();
    const second = await service.getAuthorizationHeaderIfConfigured();

    expect(first).toEqual({ Authorization: "Bearer token-123" });
    expect(second).toEqual({ Authorization: "Bearer token-123" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("requests a new token after expiration", async () => {
    process.env.HARVEST_OIDC_TOKEN_URL = "https://id.example/token";
    process.env.HARVEST_OIDC_CLIENT_ID = "client-id";
    process.env.HARVEST_OIDC_CLIENT_SECRET = "client-secret";

    const nowSpy = jest.spyOn(Date, "now");
    nowSpy.mockReturnValue(1_000_000);

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "first-token", expires_in: 60 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "second-token", expires_in: 60 }),
      } as Response);

    const service = new OidcAuthService();
    await service.getAuthorizationHeaderIfConfigured();

    nowSpy.mockReturnValue(2_000_000);
    const second = await service.getAuthorizationHeaderIfConfigured();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(second).toEqual({ Authorization: "Bearer second-token" });
  });

  test("throws when token endpoint returns non-ok response", async () => {
    process.env.HARVEST_OIDC_TOKEN_URL = "https://id.example/token";
    process.env.HARVEST_OIDC_CLIENT_ID = "client-id";
    process.env.HARVEST_OIDC_CLIENT_SECRET = "client-secret";

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    } as Response);

    const service = new OidcAuthService();
    await expect(service.getAuthorizationHeaderIfConfigured()).rejects.toThrow(
      "Failed to retrieve OIDC access token from https://id.example/token (401 Unauthorized)"
    );
  });

  test("throws detailed message when token fetch itself fails", async () => {
    process.env.HARVEST_OIDC_TOKEN_URL = "https://id.example/token";
    process.env.HARVEST_OIDC_CLIENT_ID = "client-id";
    process.env.HARVEST_OIDC_CLIENT_SECRET = "client-secret";

    const cause = new Error("connect ECONNREFUSED 127.0.0.1:8443");
    const error = new Error("fetch failed");
    (error as Error & { cause?: Error }).cause = cause;
    fetchMock.mockRejectedValueOnce(error);

    const service = new OidcAuthService();
    await expect(service.getAuthorizationHeaderIfConfigured()).rejects.toThrow(
      "Failed to retrieve OIDC access token from https://id.example/token: fetch failed | cause: connect ECONNREFUSED 127.0.0.1:8443"
    );
  });
});
