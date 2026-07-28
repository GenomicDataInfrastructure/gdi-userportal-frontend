// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { fetchGa4ghPassport } from "./passport";
import { RetrieveGrantedDatasetIdentifiers } from "@/app/api/access-management/open-api/schemas";
import { extractControlledAccessGrants } from "./visa";

/**
 * GA4GH Passport/Visa-based entitlement retrieval.
 *
 * Fetches raw Visa JWTs from the LS-AAI userinfo endpoint.
 * Decodes Visa JWTs and extracts ControlledAccessGrants visas.
 * TODO (ART-27610): validate Visa JWT signatures.
 * TODO (ART-27611): handle visa expiry / refresh.
 */
export const retrieveEntitlementsV2 =
  async (): Promise<RetrieveGrantedDatasetIdentifiers> => {
    const visaJwts = await fetchGa4ghPassport();
    const grants = extractControlledAccessGrants(visaJwts);

    const entitlements = grants.map((grant) => ({
      datasetId: grant.datasetId,
      start: new Date(grant.asserted * 1000).toISOString(),
      end: new Date(grant.exp * 1000).toISOString(),
    }));

    return { entitlements };
  };
