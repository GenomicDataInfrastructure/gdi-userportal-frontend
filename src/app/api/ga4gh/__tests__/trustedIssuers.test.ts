// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  getTrustedVisaIssuers,
  isTrustedVisaIssuer,
  normalizeVisaIssuer,
} from "../trustedIssuers";

describe("trusted Visa issuers", () => {
  const originalTrustedIssuers = process.env.TRUSTED_VISA_ISSUERS;
  const originalAllowLocalhostJku = process.env.ALLOW_LOCALHOST_JKU;

  afterEach(() => {
    if (originalTrustedIssuers === undefined) {
      delete process.env.TRUSTED_VISA_ISSUERS;
    } else {
      process.env.TRUSTED_VISA_ISSUERS = originalTrustedIssuers;
    }
    if (originalAllowLocalhostJku === undefined) {
      delete process.env.ALLOW_LOCALHOST_JKU;
    } else {
      process.env.ALLOW_LOCALHOST_JKU = originalAllowLocalhostJku;
    }
  });

  test("returns an empty set when configuration is unset or empty", () => {
    delete process.env.TRUSTED_VISA_ISSUERS;
    expect(getTrustedVisaIssuers()).toEqual(new Set());

    process.env.TRUSTED_VISA_ISSUERS = "  ,  ";
    expect(getTrustedVisaIssuers()).toEqual(new Set());
  });

  test("parses comma-separated issuers and trims whitespace", () => {
    process.env.TRUSTED_VISA_ISSUERS =
      " https://issuer-a.example.org , https://issuer-b.example.org/path ";

    expect(getTrustedVisaIssuers()).toEqual(
      new Set([
        "https://issuer-a.example.org",
        "https://issuer-b.example.org/path",
      ])
    );
  });

  test("normalizes trailing slashes while keeping paths significant", () => {
    const trusted = new Set(["https://issuer.example.org/tenant"]);

    expect(
      isTrustedVisaIssuer("https://issuer.example.org/tenant/", trusted)
    ).toBe(true);
    expect(
      isTrustedVisaIssuer("https://issuer.example.org/other", trusted)
    ).toBe(false);
  });

  test("skips malformed and unsafe configuration entries", () => {
    process.env.TRUSTED_VISA_ISSUERS =
      "not-a-url,http://issuer.example.org,ftp://issuer.example.org," +
      "https://user:pass@issuer.example.org,https://issuer.example.org?q=1," +
      "https://issuer.example.org/#fragment,https://valid.example.org";

    expect(getTrustedVisaIssuers()).toEqual(
      new Set(["https://valid.example.org"])
    );
  });

  test("rejects missing and non-string runtime issuer values", () => {
    const trusted = new Set(["https://issuer.example.org"]);

    expect(isTrustedVisaIssuer(undefined, trusted)).toBe(false);
    expect(isTrustedVisaIssuer(42, trusted)).toBe(false);
    expect(isTrustedVisaIssuer({}, trusted)).toBe(false);
  });

  test("allows local HTTP only when the development exception is enabled", () => {
    expect(normalizeVisaIssuer("http://localhost:4010")).toBeNull();

    process.env.ALLOW_LOCALHOST_JKU = "true";
    expect(normalizeVisaIssuer("http://localhost:4010/")).toBe(
      "http://localhost:4010"
    );
    expect(normalizeVisaIssuer("http://remote.example.org")).toBeNull();
  });
});
