// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jwtDecode } from "jwt-decode";
import { createHash } from "node:crypto";
import { getToken } from "@/app/api/auth/auth";
import { fetchGa4ghPassport } from "./passport";
import { extractVerifiedVisas, Ga4ghVisaPayload } from "./visa";
import {
  BeaconAuthorizationStatus,
  BEACON_AUTHORIZATION_ERROR,
  BeaconAuthorizationError,
} from "./beacon-authorization.types";

type DecodedAccessToken = {
  ga4gh_visas?: string[];
};

const MAX_VISA_JWTS = 100;
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
 * Extracts raw GA4GH Visa JWTs for the current user.
 *
 * First checks the Keycloak access token for a `ga4gh_visas` claim. If the
 * claim is absent, falls back to the LS-AAI userinfo flow via the Keycloak
 * identity-provider token endpoint.
 *
 * @returns Visa JWT strings and whether any passport/visa claim was present.
 */
async function fetchGa4ghVisas(
  keycloakAccessToken?: string | null
): Promise<{
  visaJwts: string[];
  passportPresent: boolean;
}> {
  const token = keycloakAccessToken ?? (await getToken("access_token"));

  if (!token) {
    return { visaJwts: [], passportPresent: false };
  }

  try {
    const decodedToken = jwtDecode<DecodedAccessToken>(token);
    if (
      Array.isArray(decodedToken.ga4gh_visas) &&
      decodedToken.ga4gh_visas.every((visaJwt) => typeof visaJwt === "string")
    ) {
      return {
        visaJwts: decodedToken.ga4gh_visas.slice(0, MAX_VISA_JWTS),
        passportPresent: true,
      };
    }
  } catch {
    // Malformed access token — fall through to LS-AAI userinfo flow.
  }

  return fetchGa4ghPassport();
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
