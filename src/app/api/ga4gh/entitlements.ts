// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { fetchGa4ghPassport } from "./passport";
import { extractVerifiedControlledAccessGrants } from "./visa";

/**
 * GA4GH Passport/Visa-based entitlement retrieval.
 *
 * Fetches raw Visa JWTs from the LS-AAI userinfo endpoint.
 * Decodes and signature-validates Visa JWTs, keeping only
 * ControlledAccessGrants visas from trusted issuers.
 * TODO (ART-27611): handle visa expiry / refresh.
 */
export const retrieveEntitlementsV2 = async () => {
  const visaJwts = await fetchGa4ghPassport();
  const grants = await extractVerifiedControlledAccessGrants(visaJwts);

  const entitlements = grants.map((grant) => ({
    datasetId: grant.datasetId,
    start: grant.iat ? new Date(grant.iat * 1000).toISOString() : undefined,
    end: grant.exp ? new Date(grant.exp * 1000).toISOString() : undefined,
    source: grant.source,
    by: grant.by,
  }));

  return { entitlements };
};
