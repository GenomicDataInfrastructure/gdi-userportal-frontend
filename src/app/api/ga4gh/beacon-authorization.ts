// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { createHash } from "node:crypto";
import { getToken } from "@/app/api/auth/auth";
import { extractVerifiedVisas, Ga4ghVisaPayload } from "./visa";
import { fetchGa4ghVisas } from "./passport";
import {
  BeaconAuthorizationStatus,
  BEACON_AUTHORIZATION_ERROR,
  BeaconAuthorizationError,
} from "./beacon-authorization.types";

const CACHE_TTL_MS = 60_000;

const visaCache = new Map<
  string,
  { visaJwts: string[]; verified: Ga4ghVisaPayload[]; at: number }
>();

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function pruneVisaCache(now: number): void {
  for (const [key, entry] of visaCache) {
    if (now - entry.at >= CACHE_TTL_MS) {
      visaCache.delete(key);
    }
  }
}

/**
 * Resets the internal visa cache and environment logging state.
 *
 * Intended for tests only.
 */
export function __resetBeaconAuthorizationCache(): void {
  visaCache.clear();
}

/**
 * Validates decoded (but not yet signature-verified) visa payloads against the
 * configured ResearcherStatus and AcceptedTermsAndPolicies requirements.
 *
 * This helper is useful for client-side pre-flight checks where the visas have
 * already been verified server-side.
 */
export function validateBeaconVisaStatuses(
  visas: Ga4ghVisaPayload[]
): BeaconAuthorizationStatus {
  const nowSeconds = Math.floor(Date.now() / 1000);

  const hasResearcherStatus = visas.some((visa) => {
    const v = visa.ga4gh_visa_v1;
    return (
      v.type === "ResearcherStatus" &&
      v.by === "so" &&
      visa.exp !== undefined &&
      visa.exp >= nowSeconds
    );
  });

  const hasAcceptedTC = visas.some((visa) => {
    const v = visa.ga4gh_visa_v1;
    return (
      v.type === "AcceptedTermsAndPolicies" &&
      v.by === "self" &&
      visa.exp !== undefined &&
      visa.exp >= nowSeconds
    );
  });

  return { hasResearcherStatus, hasAcceptedTC };
}

async function getVerifiedVisas(refresh = false): Promise<{
  visaJwts: string[];
  verified: Ga4ghVisaPayload[];
}> {
  const token = await getToken("access_token");
  const now = Date.now();

  pruneVisaCache(now);

  if (token && !refresh) {
    const cached = visaCache.get(hashToken(token));
    if (cached && now - cached.at < CACHE_TTL_MS) {
      return { visaJwts: cached.visaJwts, verified: cached.verified };
    }
  }

  const { visaJwts, passportPresent } = await fetchGa4ghVisas(token);

  if (!passportPresent || visaJwts.length === 0) {
    return { visaJwts, verified: [] };
  }

  const verified = await extractVerifiedVisas(visaJwts).then((entries) =>
    entries.map((entry) => entry.payload)
  );

  if (token) {
    visaCache.set(hashToken(token), { visaJwts, verified, at: now });
  }

  return { visaJwts, verified };
}

/**
 * Checks whether the current user is authorized to execute Beacon queries.
 *
 * Fetches GA4GH visas from the access token or LS-AAI userinfo endpoint,
 * verifies their signatures, and validates the required ResearcherStatus and
 * AcceptedTermsAndPolicies visas.
 *
 * @returns Authorization status flags.
 */
export async function checkBeaconAuthorization(options?: {
  refresh?: boolean;
}): Promise<BeaconAuthorizationStatus> {
  const { verified } = await getVerifiedVisas(options?.refresh);
  return validateBeaconVisaStatuses(verified);
}

/**
 * Asserts that the current user is authorized to execute Beacon queries.
 *
 * @throws BeaconAuthorizationError with HTTP-like details when authorization
 *   is insufficient.
 */
export async function assertBeaconAuthorization(): Promise<void> {
  const status = await checkBeaconAuthorization();

  if (!status.hasResearcherStatus || !status.hasAcceptedTC) {
    throw new BeaconAuthorizationError(
      "Beacon query access requires active Researcher status and accepted Terms & Conditions.",
      status
    );
  }
}
