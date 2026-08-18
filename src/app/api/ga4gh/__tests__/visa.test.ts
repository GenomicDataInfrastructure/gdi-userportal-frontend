// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import {
  generateKeyPair,
  exportJWK,
  createLocalJWKSet,
  SignJWT,
  KeyLike,
  JWTPayload,
} from "jose";
import * as jose from "jose";
import {
  decodeVisaPayload,
  extractControlledAccessGrants,
  extractVerifiedControlledAccessGrants,
  Ga4ghVisaPayload,
} from "../visa";
import { JwksResolver } from "../jwks";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeVisaJwt(payload: object): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.fakesignature`;
}

const CONTROLLED_ACCESS_VISA: Ga4ghVisaPayload = {
  iss: "https://daam.portal.dev.gdi.lu/",
  sub: "2951f8b568bd3595d9a291605e88207fac707718@lifescience-ri.eu",
  iat: 1785223779,
  exp: 1816759779,
  ga4gh_visa_v1: {
    type: "ControlledAccessGrants",
    value: "GDID-12345678-11se",
    source: "https://daam.portal.dev.gdi.lu/",
    by: "dac",
    iat: 1785223779,
    exp: 1816759779,
  },
};

const RESEARCHER_STATUS_VISA: Ga4ghVisaPayload = {
  iss: "https://other-issuer.example.org/",
  sub: "2951f8b568bd3595d9a291605e88207fac707718@lifescience-ri.eu",
  iat: 1785223779,
  exp: 1816759779,
  ga4gh_visa_v1: {
    type: "ResearcherStatus",
    value: "https://doi.org/10.1038/s41431-018-0219-y",
    source: "https://other-issuer.example.org/",
    by: "peer",
  },
};

// ---------------------------------------------------------------------------
// decodeVisaPayload
// ---------------------------------------------------------------------------

describe("decodeVisaPayload", () => {
  test("decodes a valid ControlledAccessGrants visa JWT", () => {
    const jwt = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    const result = decodeVisaPayload(jwt);

    expect(result).not.toBeNull();
    expect(result!.iss).toBe("https://daam.portal.dev.gdi.lu/");
    expect(result!.exp).toBe(1816759779);
    expect(result!.ga4gh_visa_v1.type).toBe("ControlledAccessGrants");
    expect(result!.ga4gh_visa_v1.value).toBe("GDID-12345678-11se");
  });

  test("decodes a valid ResearcherStatus visa JWT", () => {
    const jwt = makeVisaJwt(RESEARCHER_STATUS_VISA);
    const result = decodeVisaPayload(jwt);

    expect(result).not.toBeNull();
    expect(result!.ga4gh_visa_v1.type).toBe("ResearcherStatus");
  });

  test("returns null for a malformed JWT", () => {
    expect(decodeVisaPayload("not.a.jwt")).toBeNull();
    expect(decodeVisaPayload("")).toBeNull();
    expect(decodeVisaPayload("only-one-segment")).toBeNull();
  });

  test("returns null when ga4gh_visa_v1 claim is absent", () => {
    const jwt = makeVisaJwt({
      iss: "https://example.org",
      sub: "user",
      iat: 0,
      exp: 0,
    });
    expect(decodeVisaPayload(jwt)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// extractControlledAccessGrants
// ---------------------------------------------------------------------------

describe("extractControlledAccessGrants", () => {
  test("extracts ControlledAccessGrants and ignores other visa types", () => {
    const jwtA = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    const jwtB = makeVisaJwt(RESEARCHER_STATUS_VISA);

    const grants = extractControlledAccessGrants([jwtA, jwtB]);

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");
  });

  test("maps grant fields correctly from the visa payload", () => {
    const jwt = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    const [grant] = extractControlledAccessGrants([jwt]);

    expect(grant.datasetId).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.value);
    expect(grant.iat).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.iat);
    expect(grant.source).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.source);
    expect(grant.by).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.by);
    expect(grant.exp).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.exp);
  });

  test("returns empty array when passport contains no ControlledAccessGrants", () => {
    const jwt = makeVisaJwt(RESEARCHER_STATUS_VISA);
    expect(extractControlledAccessGrants([jwt])).toEqual([]);
  });

  test("returns empty array for an empty passport", () => {
    expect(extractControlledAccessGrants([])).toEqual([]);
  });

  test("returns undefined iat and exp when ga4gh_visa_v1 omits them", () => {
    const visaWithoutTimestamps: Ga4ghVisaPayload = {
      ...CONTROLLED_ACCESS_VISA,
      ga4gh_visa_v1: {
        type: "ControlledAccessGrants",
        value: "GDID-12345678-11se",
        source: "https://daam.portal.dev.gdi.lu/",
        by: "dac",
      },
    };
    const [grant] = extractControlledAccessGrants([
      makeVisaJwt(visaWithoutTimestamps),
    ]);
    expect(grant.iat).toBeUndefined();
    expect(grant.exp).toBeUndefined();
  });

  test("skips malformed JWTs without throwing", () => {
    const validJwt = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    const grants = extractControlledAccessGrants(["bad-token", validJwt]);

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");
  });

  test("extracts multiple ControlledAccessGrants from a single passport", () => {
    const second: Ga4ghVisaPayload = {
      ...CONTROLLED_ACCESS_VISA,
      ga4gh_visa_v1: {
        ...CONTROLLED_ACCESS_VISA.ga4gh_visa_v1,
        value: "GDID-99999999-abc",
      },
    };

    const grants = extractControlledAccessGrants([
      makeVisaJwt(CONTROLLED_ACCESS_VISA),
      makeVisaJwt(RESEARCHER_STATUS_VISA),
      makeVisaJwt(second),
    ]);

    expect(grants).toHaveLength(2);
    expect(grants.map((g) => g.datasetId)).toEqual([
      "GDID-12345678-11se",
      "GDID-99999999-abc",
    ]);
  });
});

// ---------------------------------------------------------------------------
// extractVerifiedControlledAccessGrants — signature validation with real keypairs
// ---------------------------------------------------------------------------

describe("extractVerifiedControlledAccessGrants", () => {
  const originalSkipSignatureVerification =
    process.env.SKIP_VISA_SIGNATURE_VERIFICATION;

  // Keypairs generated once per test-suite run (async beforeAll)
  let privateKeyA: KeyLike;
  let publicKeyA: KeyLike;
  let privateKeyB: KeyLike;
  let publicKeyB: KeyLike;

  // JwksResolver that trusts only issuer-A
  let resolverTrustingA: JwksResolver;
  // JwksResolver that trusts no one
  let rejectAllResolver: JwksResolver;

  beforeAll(async () => {
    ({ privateKey: privateKeyA, publicKey: publicKeyA } =
      await generateKeyPair("RS256"));
    ({ privateKey: privateKeyB, publicKey: publicKeyB } =
      await generateKeyPair("RS256"));

    const jwkA = { ...(await exportJWK(publicKeyA)), kid: "key-a" };
    const localJwksA = createLocalJWKSet({ keys: [jwkA] });
    resolverTrustingA = async (jku: string) => {
      if (new URL(jku).origin === "https://issuer-a.example.org")
        return localJwksA;
      throw new Error(`Untrusted jku: ${jku}`);
    };

    rejectAllResolver = async (jku: string) => {
      throw new Error(`No JWKS for: ${jku}`);
    };
  });

  afterEach(() => {
    if (originalSkipSignatureVerification === undefined) {
      delete process.env.SKIP_VISA_SIGNATURE_VERIFICATION;
    } else {
      process.env.SKIP_VISA_SIGNATURE_VERIFICATION =
        originalSkipSignatureVerification;
    }
  });

  const ISSUER_JKU = "https://issuer-a.example.org/jwks.json";

  /**
   * Signs a visa payload. By default, `jku` is derived from the payload's `iss`
   * so that trust-check and signature-check use the same origin.
   */
  async function signVisaJwt(
    payload: object,
    privateKey: KeyLike,
    options: { kid?: string; jku?: string } = {}
  ): Promise<string> {
    const iss =
      (payload as { iss?: string }).iss ?? "https://issuer-a.example.org";
    const { kid = "key-a", jku = `${new URL(iss).origin}/jwks.json` } = options;
    return new SignJWT(payload as JWTPayload)
      .setProtectedHeader({ alg: "RS256", kid, jku })
      .sign(privateKey);
  }

  const VISA_PAYLOAD = {
    iss: "https://issuer-a.example.org",
    sub: "user@lifescience-ri.eu",
    iat: 1785223779,
    exp: 9999999999,
    ga4gh_visa_v1: {
      type: "ControlledAccessGrants",
      value: "GDID-12345678-11se",
      source: "https://issuer-a.example.org",
      by: "dac",
      iat: 1785223779,
      exp: 9999999999,
    },
  };

  test("accepts a ControlledAccessGrants visa with a valid RS256 signature", async () => {
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const grants = await extractVerifiedControlledAccessGrants(
      [jwt],
      resolverTrustingA
    );

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");
  });

  test("rejects a visa signed with a key not in the issuer's JWKS", async () => {
    // Signed with key-B but resolver only knows key-A for this issuer
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyB, { kid: "key-b" });
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [jwt],
      resolverTrustingA
    );

    expect(grants).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      "[visa-validation] FAILED: signature verification error",
      expect.objectContaining({ iss: "https://issuer-a.example.org" })
    );
    consoleSpy.mockRestore();
  });

  test("rejects a visa from an untrusted issuer", async () => {
    const untrustedPayload = {
      ...VISA_PAYLOAD,
      iss: "https://untrusted.example.org",
    };
    const jwt = await signVisaJwt(untrustedPayload, privateKeyA);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [jwt],
      resolverTrustingA
    );

    expect(grants).toHaveLength(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "[visa-validation] FAILED: could not resolve JWKS",
      expect.objectContaining({ iss: "https://untrusted.example.org" })
    );
    errorSpy.mockRestore();
  });

  test("logs a validation attempt for each decoded visa", async () => {
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const debugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});

    await extractVerifiedControlledAccessGrants([jwt], resolverTrustingA);

    expect(debugSpy).toHaveBeenCalledWith(
      "[visa-validation] attempt",
      expect.objectContaining({
        iss: "https://issuer-a.example.org",
        visaType: "ControlledAccessGrants",
      })
    );
    debugSpy.mockRestore();
  });

  test("silently drops malformed JWTs without throwing", async () => {
    const validJwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const grants = await extractVerifiedControlledAccessGrants(
      ["not.a.jwt", validJwt],
      resolverTrustingA
    );

    expect(grants).toHaveLength(1);
  });

  test("ignores non-ControlledAccessGrants visas without attempting signature verification", async () => {
    const researcherStatusPayload = {
      iss: "https://issuer-a.example.org",
      sub: "user@lifescience-ri.eu",
      iat: 1785223779,
      exp: 9999999999,
      ga4gh_visa_v1: {
        type: "ResearcherStatus",
        value: "https://doi.org/10.1038/s41431-018-0219-y",
        source: "https://issuer-a.example.org",
        by: "peer",
      },
    };
    const jwt = await signVisaJwt(researcherStatusPayload, privateKeyA);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [jwt],
      resolverTrustingA
    );

    expect(grants).toHaveLength(0);
    // No validation attempt should be logged — non-CAG visas are filtered before
    // any network call is made.
    expect(logSpy).not.toHaveBeenCalledWith(
      "[visa-validation] attempt",
      expect.anything()
    );
    logSpy.mockRestore();
  });

  test("rejects a ControlledAccessGrants visa with no jku in the header", async () => {
    // Sign without jku in header
    const jwtNoJku = await new SignJWT(VISA_PAYLOAD as JWTPayload)
      .setProtectedHeader({ alg: "RS256", kid: "key-a" })
      .sign(privateKeyA);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [jwtNoJku],
      resolverTrustingA
    );

    expect(grants).toHaveLength(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "[visa-validation] FAILED: jku claim missing from JWT header",
      expect.objectContaining({ iss: "https://issuer-a.example.org" })
    );
    errorSpy.mockRestore();
  });

  test("accepts visas without signature verification when explicitly disabled", async () => {
    process.env.SKIP_VISA_SIGNATURE_VERIFICATION = "true";
    const resolverSpy = jest.fn(resolverTrustingA);

    const grants = await extractVerifiedControlledAccessGrants(
      [makeVisaJwt(VISA_PAYLOAD)],
      resolverSpy
    );

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");
    expect(resolverSpy).not.toHaveBeenCalled();
  });

  test("accepts visas without passing an explicit resolver when signature verification is disabled", async () => {
    process.env.SKIP_VISA_SIGNATURE_VERIFICATION = "true";

    const grants = await extractVerifiedControlledAccessGrants([
      makeVisaJwt(VISA_PAYLOAD),
    ]);

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");
  });

  test("rejects a visa with an unreadable protected header", async () => {
    const invalidHeaderJwt = `${Buffer.from("not-json").toString(
      "base64url"
    )}.${Buffer.from(JSON.stringify(VISA_PAYLOAD)).toString(
      "base64url"
    )}.signature`;
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [invalidHeaderJwt],
      resolverTrustingA
    );

    expect(grants).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      "[visa-validation] FAILED: could not decode JWT header",
      expect.objectContaining({ iss: "https://issuer-a.example.org" })
    );
    errorSpy.mockRestore();
  });

  test("logs string resolver failures when JWKS resolution rejects with a non-Error value", async () => {
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants([jwt], async () => {
      throw "resolver failed";
    });

    expect(grants).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      "[visa-validation] FAILED: could not resolve JWKS",
      expect.objectContaining({ error: "resolver failed" })
    );
    errorSpy.mockRestore();
  });

  test("returns empty array when all issuers are untrusted", async () => {
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const grants = await extractVerifiedControlledAccessGrants(
      [jwt],
      rejectAllResolver
    );
    expect(grants).toEqual([]);
  });

  test("processes a mixed passport and returns only verified ControlledAccessGrants", async () => {
    const validJwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const untrustedPayload = {
      ...VISA_PAYLOAD,
      iss: "https://untrusted.example.org",
    };
    const untrustedJwt = await signVisaJwt(untrustedPayload, privateKeyA);
    const badSigJwt = await signVisaJwt(VISA_PAYLOAD, privateKeyB, {
      kid: "key-b",
    });

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [validJwt, untrustedJwt, badSigJwt, "malformed"],
      resolverTrustingA
    );

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");

    errorSpy.mockRestore();
  });

  test("maps grant fields correctly from a verified visa payload", async () => {
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const [grant] = await extractVerifiedControlledAccessGrants(
      [jwt],
      resolverTrustingA
    );

    expect(grant.datasetId).toBe(VISA_PAYLOAD.ga4gh_visa_v1.value);
    expect(grant.iat).toBe(VISA_PAYLOAD.ga4gh_visa_v1.iat);
    expect(grant.exp).toBe(VISA_PAYLOAD.ga4gh_visa_v1.exp);
    expect(grant.source).toBe(VISA_PAYLOAD.ga4gh_visa_v1.source);
    expect(grant.by).toBe(VISA_PAYLOAD.ga4gh_visa_v1.by);
  });

  test("logs rejected visas via console.warn when visas fail signature verification", async () => {
    // Signed with key-B but resolver only trusts key-A — will fail verification
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyB, { kid: "key-b" });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await extractVerifiedControlledAccessGrants([jwt], resolverTrustingA);

    expect(warnSpy).toHaveBeenCalledWith(
      "[visa-validation] REJECTED visas (failed signature verification)",
      expect.objectContaining({
        count: 1,
        byIssuerAndType: expect.objectContaining({
          "https://issuer-a.example.org|ControlledAccessGrants": 1,
        }),
      })
    );
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("logs all rejected visas in a single console.warn call", async () => {
    const jwtBadSig = await signVisaJwt(VISA_PAYLOAD, privateKeyB, {
      kid: "key-b",
    });
    const untrustedPayload = {
      ...VISA_PAYLOAD,
      iss: "https://untrusted.example.org",
    };
    const jwtUntrusted = await signVisaJwt(untrustedPayload, privateKeyA);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await extractVerifiedControlledAccessGrants(
      [jwtBadSig, jwtUntrusted],
      resolverTrustingA
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      "[visa-validation] REJECTED visas (failed signature verification)",
      expect.objectContaining({
        count: 2,
        byIssuerAndType: expect.objectContaining({
          "https://issuer-a.example.org|ControlledAccessGrants": 1,
          "https://untrusted.example.org|ControlledAccessGrants": 1,
        }),
      })
    );
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("aggregates repeated rejection counts for the same issuer", async () => {
    const jwtBadSigA = await signVisaJwt(VISA_PAYLOAD, privateKeyB, {
      kid: "key-b",
    });
    const jwtBadSigB = await signVisaJwt(
      {
        ...VISA_PAYLOAD,
        ga4gh_visa_v1: {
          ...VISA_PAYLOAD.ga4gh_visa_v1,
          value: "GDID-OTHER",
        },
      },
      privateKeyB,
      { kid: "key-b" }
    );
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await extractVerifiedControlledAccessGrants(
      [jwtBadSigA, jwtBadSigB],
      resolverTrustingA
    );

    expect(warnSpy).toHaveBeenCalledWith(
      "[visa-validation] REJECTED visas (failed signature verification)",
      expect.objectContaining({
        count: 2,
        byIssuerAndType: {
          "https://issuer-a.example.org|ControlledAccessGrants": 2,
        },
      })
    );
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("does not emit console.warn when all visas are accepted", async () => {
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await extractVerifiedControlledAccessGrants([jwt], resolverTrustingA);

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  test("does not emit console.warn when passport is empty", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await extractVerifiedControlledAccessGrants([], resolverTrustingA);

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  // ---------------------------------------------------------------------------
  // Visa expiry filtering
  // ---------------------------------------------------------------------------

  test("filters out a visa whose ga4gh_visa_v1.exp is in the past", async () => {
    const expiredPayload = {
      ...VISA_PAYLOAD,
      ga4gh_visa_v1: { ...VISA_PAYLOAD.ga4gh_visa_v1, exp: 1 }, // epoch+1s
    };
    const jwt = await signVisaJwt(expiredPayload, privateKeyA);
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [jwt],
      resolverTrustingA
    );

    expect(grants).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalledWith(
      "[visa-validation] SKIPPED expired visas",
      expect.objectContaining({ count: 1 })
    );
    warnSpy.mockRestore();
  });

  test("keeps a visa with no exp field (no expiry set)", async () => {
    const noExpPayload = {
      ...VISA_PAYLOAD,
      ga4gh_visa_v1: {
        type: VISA_PAYLOAD.ga4gh_visa_v1.type,
        value: VISA_PAYLOAD.ga4gh_visa_v1.value,
        source: VISA_PAYLOAD.ga4gh_visa_v1.source,
        by: VISA_PAYLOAD.ga4gh_visa_v1.by,
        iat: VISA_PAYLOAD.ga4gh_visa_v1.iat,
        // exp intentionally omitted
      },
    };
    const jwt = await signVisaJwt(noExpPayload, privateKeyA);
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [jwt],
      resolverTrustingA
    );

    expect(grants).toHaveLength(1);
    expect(warnSpy).not.toHaveBeenCalledWith(
      "[visa-validation] SKIPPED expired visas",
      expect.anything()
    );
    warnSpy.mockRestore();
  });

  test("does not verify expired visas (no JWKS call made)", async () => {
    const expiredPayload = {
      ...VISA_PAYLOAD,
      ga4gh_visa_v1: { ...VISA_PAYLOAD.ga4gh_visa_v1, exp: 1 },
    };
    const jwt = await signVisaJwt(expiredPayload, privateKeyA);
    const resolverSpy = jest.fn(resolverTrustingA);
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await extractVerifiedControlledAccessGrants([jwt], resolverSpy);

    expect(resolverSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  test("returns only non-expired visas from a mixed passport", async () => {
    const expiredPayload = {
      ...VISA_PAYLOAD,
      ga4gh_visa_v1: {
        ...VISA_PAYLOAD.ga4gh_visa_v1,
        value: "GDID-EXPIRED",
        exp: 1,
      },
    };
    const validJwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const expiredJwt = await signVisaJwt(expiredPayload, privateKeyA);
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants(
      [validJwt, expiredJwt],
      resolverTrustingA
    );

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");
    warnSpy.mockRestore();
  });

  test("aggregates repeated expired visas for the same issuer", async () => {
    const expiredPayloadA = {
      ...VISA_PAYLOAD,
      ga4gh_visa_v1: { ...VISA_PAYLOAD.ga4gh_visa_v1, value: "GDID-EXPIRED-A", exp: 1 },
    };
    const expiredPayloadB = {
      ...VISA_PAYLOAD,
      ga4gh_visa_v1: { ...VISA_PAYLOAD.ga4gh_visa_v1, value: "GDID-EXPIRED-B", exp: 1 },
    };
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const grants = await extractVerifiedControlledAccessGrants([
      await signVisaJwt(expiredPayloadA, privateKeyA),
      await signVisaJwt(expiredPayloadB, privateKeyA),
    ], resolverTrustingA);

    expect(grants).toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith(
      "[visa-validation] SKIPPED expired visas",
      expect.objectContaining({
        count: 2,
        byIssuer: { "https://issuer-a.example.org": 2 },
      })
    );
    warnSpy.mockRestore();
  });

  test("logs string signature verification failures when jwtVerify rejects with a non-Error value", async () => {
    const jwt = await signVisaJwt(VISA_PAYLOAD, privateKeyA);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const jwtVerifySpy = jest
      .spyOn(jose, "jwtVerify")
      .mockRejectedValueOnce("bad signature");

    const grants = await extractVerifiedControlledAccessGrants(
      [jwt],
      resolverTrustingA
    );

    expect(grants).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      "[visa-validation] FAILED: signature verification error",
      expect.objectContaining({ error: "bad signature" })
    );
    jwtVerifySpy.mockRestore();
    errorSpy.mockRestore();
  });
});
