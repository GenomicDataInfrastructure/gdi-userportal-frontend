// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { clearJwksCache, resolveJwksForJku, validateJku } from "../jwks";

const JKU = "https://daam.portal.dev.gdi.lu/.well-known/jwks.json";

// ---------------------------------------------------------------------------
// validateJku
// ---------------------------------------------------------------------------

describe("validateJku", () => {
  test("accepts a valid HTTPS jku", () => {
    expect(() => validateJku(JKU)).not.toThrow();
  });

  test("accepts any HTTPS path under any hostname", () => {
    expect(() =>
      validateJku(
        "https://issuer.example.org/realms/gdi/protocol/openid-connect/certs"
      )
    ).not.toThrow();
  });

  test("throws when jku is not a valid URL", () => {
    expect(() => validateJku("not-a-url")).toThrow("Invalid jku URL");
  });

  test("throws when jku uses HTTP instead of HTTPS", () => {
    expect(() =>
      validateJku("http://daam.portal.dev.gdi.lu/jwks.json")
    ).toThrow("jku must use HTTPS scheme");
  });
});

// ---------------------------------------------------------------------------
// resolveJwksForJku
// ---------------------------------------------------------------------------

describe("resolveJwksForJku", () => {
  beforeEach(() => clearJwksCache());
  afterEach(() => clearJwksCache());

  test("throws when jku uses HTTP", async () => {
    await expect(
      resolveJwksForJku("http://daam.portal.dev.gdi.lu/jwks.json")
    ).rejects.toThrow("jku must use HTTPS scheme");
  });

  test("throws when jku is not a valid URL", async () => {
    await expect(resolveJwksForJku("not-a-url")).rejects.toThrow(
      "Invalid jku URL"
    );
  });

  test("returns a key-fetcher function for a valid HTTPS jku", async () => {
    const result = await resolveJwksForJku(JKU);
    expect(typeof result).toBe("function");
  });

  test("caches the key-fetcher per jku (same object reference)", async () => {
    const first = await resolveJwksForJku(JKU);
    const second = await resolveJwksForJku(JKU);
    expect(first).toBe(second);
  });

  test("re-creates the key-fetcher after clearJwksCache()", async () => {
    const first = await resolveJwksForJku(JKU);
    clearJwksCache();
    const second = await resolveJwksForJku(JKU);
    expect(first).not.toBe(second);
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
