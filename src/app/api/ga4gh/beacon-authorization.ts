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

const hasLoggedMissingEnv: Record<string, boolean> = {};
const visaCache = new Map<
  string,
  { visaJwts: string[]; verified: Ga4ghVisaPayload[]; at: number }
>();

function logMissingEnvOnce(name: string): void {
  if (hasLoggedMissingEnv[name]) return;
  hasLoggedMissingEnv[name] = true;
  console.debug(`[beacon-authorization] ${name} is not configured`);
}

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
  for (const key of Object.keys(hasLoggedMissingEnv)) {
    delete hasLoggedMissingEnv[key];
  }
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
  // TODO(ART-28730): re-enable value and expiry checks once
  // RESEARCHER_STATUS_URI / LEGAL_DOC_URL are configured in the Keycloak
  // visa issuer service and visa issue/exp dates are persistent.

  if (!process.env.RESEARCHER_STATUS_URI) {
    logMissingEnvOnce("RESEARCHER_STATUS_URI");
  }
  if (!process.env.LEGAL_DOC_URL) {
    logMissingEnvOnce("LEGAL_DOC_URL");
  }

  const hasResearcherStatus = visas.some((visa) => {
    const v = visa.ga4gh_visa_v1;
    return v.type === "ResearcherStatus" && v.by === "so";
  });

  const hasAcceptedTC = visas.some((visa) => {
    const v = visa.ga4gh_visa_v1;
    return v.type === "AcceptedTermsAndPolicies" && v.by === "self";
  });

  return { hasResearcherStatus, hasAcceptedTC };
}

async function getVerifiedVisas(): Promise<{
  visaJwts: string[];
  verified: Ga4ghVisaPayload[];
}> {
  const token = await getToken("access_token");
  const now = Date.now();

  pruneVisaCache(now);

  if (token) {
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
export async function checkBeaconAuthorization(): Promise<BeaconAuthorizationStatus> {
  const { verified } = await getVerifiedVisas();
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
