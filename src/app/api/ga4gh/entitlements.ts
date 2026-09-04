// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import {
  ControlledAccessGrant,
  extractVerifiedControlledAccessGrants,
} from "./visa";
import { fetchGa4ghVisas } from "./passport";

/**
 * GA4GH Passport/Visa-based entitlement retrieval.
 *
 * Resolves raw Visa JWTs from the Keycloak token or LS-AAI passport.
 * Decodes and signature-validates Visa JWTs, keeping only
 * ControlledAccessGrants visas from trusted issuers.
 * Expired visas are filtered out before signature verification.
 */
export const retrieveEntitlements = async (): Promise<{
  entitlements: {
    datasetId: string;
    start?: string;
    end?: string;
    source?: string;
    by?: string;
  }[];
  passportPresent: boolean;
}> => {
  let visaJwts: string[];
  let passportPresent: boolean;
  try {
    ({ visaJwts, passportPresent } = await fetchGa4ghVisas());
  } catch (err) {
    console.error(
      "[entitlements] Visa fetch failed; returning empty entitlements",
      { error: err instanceof Error ? err.message : String(err) }
    );
    return { entitlements: [], passportPresent: false };
  }

  let grants: ControlledAccessGrant[];
  try {
    grants = await extractVerifiedControlledAccessGrants(visaJwts);
  } catch (err) {
    console.error(
      "[entitlements] Visa grant extraction failed; returning empty entitlements",
      { error: err instanceof Error ? err.message : String(err) }
    );
    return { entitlements: [], passportPresent };
  }

  const entitlements = grants.map((grant) => ({
    datasetId: grant.datasetId,
    start: grant.iat ? new Date(grant.iat * 1000).toISOString() : undefined,
    end: grant.exp ? new Date(grant.exp * 1000).toISOString() : undefined,
    source: grant.source,
    by: grant.by,
  }));

  return { entitlements, passportPresent };
};
