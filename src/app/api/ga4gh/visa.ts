// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import "server-only";
import { jwtDecode } from "jwt-decode";
import { decodeProtectedHeader, jwtVerify } from "jose";
import { JwksResolver, resolveJwksForJku } from "./jwks";

export type Ga4ghVisaV1 = {
  type: string;
  value: string;
  source: string;
  by: string;
  iat?: number;
  exp?: number;
};

export type Ga4ghVisaPayload = {
  iss: string;
  sub: string;
  iat?: number;
  exp?: number;
  ga4gh_visa_v1: Ga4ghVisaV1;
};

export type ControlledAccessGrant = {
  datasetId: string;
  iat?: number;
  source: string;
  by: string;
  exp?: number;
};

const CONTROLLED_ACCESS_GRANTS = "ControlledAccessGrants";

/**
 * Decodes the payload of a GA4GH Visa JWT without verifying the signature.
 *
 * @returns The decoded payload, or `null` if the JWT is malformed or is
 *   missing the `ga4gh_visa_v1` claim.
 */
export function decodeVisaPayload(jwt: string): Ga4ghVisaPayload | null {
  try {
    const payload = jwtDecode<Ga4ghVisaPayload>(jwt);
    if (!payload.ga4gh_visa_v1) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts `ControlledAccessGrants` visas from a GA4GH Passport (array of
 * raw Visa JWTs). All other visa types are silently ignored.
 *
 * @param passportJwts - Raw Visa JWT strings from the `ga4gh_passport_v1` claim.
 * @returns Structured `ControlledAccessGrant` objects for every valid
 *   `ControlledAccessGrants` visa found in the passport.
 */
export function extractControlledAccessGrants(
  passportJwts: string[]
): ControlledAccessGrant[] {
  return passportJwts
    .map(decodeVisaPayload)
    .filter(
      (visa): visa is Ga4ghVisaPayload =>
        visa !== null && visa.ga4gh_visa_v1.type === CONTROLLED_ACCESS_GRANTS
    )
    .map((visa) => ({
      datasetId: visa.ga4gh_visa_v1.value,
      iat: visa.ga4gh_visa_v1.iat,
      source: visa.ga4gh_visa_v1.source,
      by: visa.ga4gh_visa_v1.by,
      exp: visa.ga4gh_visa_v1.exp,
    }));
}

// ---------------------------------------------------------------------------
// Signature validation
// ---------------------------------------------------------------------------

/**
 * Verifies the cryptographic signature of a single Visa JWT against the
 * JWKS of its stated issuer.
 *
 * Logs every attempt and every failure to support audit requirements.
 *
 * @returns `true` when the signature is valid, `false` otherwise.
 */
async function verifyVisaJwt(
  jwt: string,
  payload: Ga4ghVisaPayload,
  jwksResolver: JwksResolver
): Promise<boolean> {
  const { iss, sub } = payload;
  const visaType = payload.ga4gh_visa_v1.type;

  console.debug("[visa-validation] attempt", { iss, sub, visaType });

  // Extract the jku from the JWT's protected header.
  let jku: string | undefined;
  try {
    const header = decodeProtectedHeader(jwt);
    jku = header.jku;
  } catch (error) {
    console.error("[visa-validation] FAILED: could not decode JWT header", {
      iss,
      sub,
      visaType,
      error,
    });
    return false;
  }

  if (!jku) {
    console.error(
      "[visa-validation] FAILED: jku claim missing from JWT header",
      {
        iss,
        sub,
        visaType,
      }
    );
    return false;
  }

  const keyFetcher = await jwksResolver(jku).catch((err: unknown) => {
    console.error("[visa-validation] FAILED: could not resolve JWKS", {
      iss,
      sub,
      visaType,
      jku,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  });

  if (keyFetcher === null) return false;

  try {
    await jwtVerify(jwt, keyFetcher);
    return true;
  } catch (err) {
    console.error("[visa-validation] FAILED: signature verification error", {
      iss,
      sub,
      visaType,
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

/**
 * Validates the JWT signature of each visa against its issuer's public keys,
 * then extracts `ControlledAccessGrants` visas from the verified set.
 *
 * Visas from untrusted or unknown issuers are silently dropped after being
 * logged for audit. Signature failures are also logged and dropped.
 *
 * @param passportJwts - Raw Visa JWT strings from the `ga4gh_passport_v1` claim.
 * @param jwksResolver - Injectable JWKS resolver (defaults to the production
 *   resolver backed by `TRUSTED_VISA_ISSUERS` and OIDC discovery).
 * @returns Structured `ControlledAccessGrant` objects for every
 *   `ControlledAccessGrants` visa whose signature was successfully verified.
 */
export async function extractVerifiedControlledAccessGrants(
  passportJwts: string[],
  jwksResolver: JwksResolver = resolveJwksForJku
): Promise<ControlledAccessGrant[]> {
  // Decode and filter to ControlledAccessGrants *before* doing any network
  // calls for signature verification — other visa types are ignored entirely.
  const candidates = passportJwts
    .map((jwt) => ({ jwt, payload: decodeVisaPayload(jwt) }))
    .filter(
      (entry): entry is { jwt: string; payload: Ga4ghVisaPayload } =>
        entry.payload !== null &&
        entry.payload.ga4gh_visa_v1.type === CONTROLLED_ACCESS_GRANTS
    );

  const verified: ControlledAccessGrant[] = [];
  // Aggregate rejected visas by issuer + visa type to avoid logging
  // per-visa sensitive data (sub, datasetId) at scale.
  const rejectedByIssuerAndType: Record<string, number> = {};

  for (const { jwt, payload } of candidates) {
    const valid = await verifyVisaJwt(jwt, payload, jwksResolver);
    if (!valid) {
      const aggregateKey = `${payload.iss}|${payload.ga4gh_visa_v1.type}`;
      rejectedByIssuerAndType[aggregateKey] =
        (rejectedByIssuerAndType[aggregateKey] ?? 0) + 1;
      continue;
    }

    verified.push({
      datasetId: payload.ga4gh_visa_v1.value,
      iat: payload.ga4gh_visa_v1.iat,
      source: payload.ga4gh_visa_v1.source,
      by: payload.ga4gh_visa_v1.by,
      exp: payload.ga4gh_visa_v1.exp,
    });
  }

  const totalRejected = Object.values(rejectedByIssuerAndType).reduce(
    (sum, n) => sum + n,
    0
  );
  if (totalRejected > 0) {
    console.warn(
      "[visa-validation] REJECTED visas (failed signature verification)",
      { count: totalRejected, byIssuerAndType: rejectedByIssuerAndType }
    );
  }

  return verified;
}
