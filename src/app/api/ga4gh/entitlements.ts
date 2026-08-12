// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { fetchGa4ghPassport } from "./passport";
import {
  ControlledAccessGrant,
  extractVerifiedControlledAccessGrants,
} from "./visa";

/**
 * GA4GH Passport/Visa-based entitlement retrieval.
 *
 * Fetches raw Visa JWTs from the LS-AAI userinfo endpoint.
 * Decodes and signature-validates Visa JWTs, keeping only
 * ControlledAccessGrants visas from trusted issuers.
 *
 * Degrades gracefully on failure: if passport fetching or visa extraction
 * fails for any reason, an empty entitlements list is returned and the
 * error is logged server-side only — no sensitive details are surfaced to
 * callers.
 *
 * TODO (ART-27611): handle visa expiry / refresh.
 */
export const retrieveEntitlementsV2 = async (): Promise<{
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
    ({ visaJwts, passportPresent } = await fetchGa4ghPassport());
  } catch (err) {
    console.error(
      "[entitlements] Passport fetch failed; returning empty entitlements",
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
