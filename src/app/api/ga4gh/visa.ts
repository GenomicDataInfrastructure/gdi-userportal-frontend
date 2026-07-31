// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import "server-only";
import { jwtDecode } from "jwt-decode";

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
      iat: visa.ga4gh_visa_v1.iat ?? visa.iat,
      source: visa.ga4gh_visa_v1.source,
      by: visa.ga4gh_visa_v1.by,
      exp: visa.ga4gh_visa_v1.exp ?? visa.exp,
    }));
}
