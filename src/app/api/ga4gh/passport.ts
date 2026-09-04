// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { getToken } from "@/app/api/auth/auth";
import { jwtDecode } from "jwt-decode";

/** Maximum time to wait for any single fetch in the passport pipeline. */
const FETCH_TIMEOUT_MS = 10_000;

/**
 * Wraps `fetch` with an `AbortSignal` timeout and maps network/timeout errors
 * to sanitized messages so no internal details leak to callers.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutErrorMessage: string,
  unreachableErrorMessage: string
): Promise<Response> {
  try {
    return await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error(timeoutErrorMessage);
    }
    throw new Error(unreachableErrorMessage);
  }
}

type LsAaiTokenResponse = {
  access_token?: string;
  error?: string;
  [key: string]: unknown;
};

type UserinfoResponse = {
  sub?: string;
  ga4gh_passport_v1?: string[];
  error?: string;
  [key: string]: unknown;
};

type DecodedAccessToken = {
  ga4gh_visas?: string[];
};

const MAX_VISA_JWTS = 100;

/**
 * The result of fetching a GA4GH Passport.
 *
 * `passportPresent` is `true` when the LS-AAI userinfo response contained the
 * `ga4gh_passport_v1` claim (even if it was an empty array). It is `false` when
 * the user is unauthenticated or the claim was absent from the response.
 */
export type PassportFetchResult = {
  visaJwts: string[];
  passportPresent: boolean;
};

/**
 * Step 1: Exchanges the Keycloak access token for an LS-AAI access token via
 * the Keycloak identity-provider token endpoint.
 *
 * GET `{KEYCLOAK_ISSUER_URL}/broker/LSAAI/token`
 *
 * @param keycloakAccessToken - The user's current Keycloak access token.
 * @returns The LS-AAI access token string.
 * @throws If the broker request fails or returns no access token.
 */
async function exchangeKeycloakTokenForLsAai(
  keycloakAccessToken: string
): Promise<string> {
  const keycloakIssuerUrl = process.env.KEYCLOAK_ISSUER_URL;
  if (!keycloakIssuerUrl) {
    throw new Error(
      "Missing required environment variable: KEYCLOAK_ISSUER_URL"
    );
  }
  const brokerUrl = `${keycloakIssuerUrl}/broker/LSAAI/token`;

  const response = await fetchWithTimeout(
    brokerUrl,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${keycloakAccessToken}` },
      cache: "no-store",
    },
    "LS-AAI broker endpoint timed out",
    "LS-AAI broker endpoint unreachable"
  );

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errorBody = await response.json();
      if (errorBody.error) detail = errorBody.error;
    } catch {
      // non-JSON body — keep statusText
    }
    throw new Error(
      `LS-AAI token exchange failed: ${response.status} ${detail}`
    );
  }

  const data: LsAaiTokenResponse = await response.json();

  if (!data.access_token) {
    throw new Error("LS-AAI token exchange returned no access_token");
  }

  return data.access_token;
}

/**
 * Step 2: Fetches the GA4GH Passport from the LS-AAI userinfo endpoint using
 * an LS-AAI access token.
 *
 * POST `{LS_AAI_USERINFO_URL}`
 *
 * @param lsAaiAccessToken - A valid LS-AAI access token.
 * @returns Passport fetch result including visa JWTs and whether the
 *   `ga4gh_passport_v1` claim was present.
 * @throws If the userinfo request fails with a non-OK status.
 */
async function fetchPassportFromLsAai(
  lsAaiAccessToken: string
): Promise<PassportFetchResult> {
  const userinfoUrl = process.env.LS_AAI_USERINFO_URL;
  if (!userinfoUrl) {
    throw new Error(
      "Missing required environment variable: LS_AAI_USERINFO_URL"
    );
  }

  const response = await fetchWithTimeout(
    userinfoUrl,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${lsAaiAccessToken}` },
      cache: "no-store",
    },
    "LS-AAI userinfo endpoint timed out",
    "LS-AAI userinfo endpoint unreachable"
  );

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errorBody = await response.json();
      if (errorBody.error) detail = errorBody.error;
    } catch {
      // non-JSON body — keep statusText
    }
    throw new Error(
      `LS-AAI userinfo request failed: ${response.status} ${detail}`
    );
  }

  const data: UserinfoResponse = await response.json();

  if (!data.ga4gh_passport_v1) {
    console.warn(
      "[passport] ga4gh_passport_v1 claim absent from LS-AAI userinfo response",
      { sub: data.sub }
    );
    return { visaJwts: [], passportPresent: false };
  }

  return { visaJwts: data.ga4gh_passport_v1, passportPresent: true };
}

/**
 * Fetches the GA4GH Passport for the current user via a two-step flow:
 *  1. Exchange the Keycloak access token for an LS-AAI access token.
 *  2. Call the LS-AAI userinfo endpoint to retrieve `ga4gh_passport_v1`.
 *
 * @returns Passport fetch result. `passportPresent` is `false` when the user
 *   is unauthenticated or the `ga4gh_passport_v1` claim is absent.
 * @throws If either the token exchange or the userinfo request fails.
 */
export async function fetchGa4ghPassport(
  accessToken?: string | null
): Promise<PassportFetchResult> {
  const keycloakAccessToken = accessToken ?? (await getToken("access_token"));

  if (!keycloakAccessToken) {
    return { visaJwts: [], passportPresent: false };
  }

  const lsAaiAccessToken =
    await exchangeKeycloakTokenForLsAai(keycloakAccessToken);

  return fetchPassportFromLsAai(lsAaiAccessToken);
}

/**
 * Resolves raw GA4GH Visa JWTs for the current user.
 *
 * The Keycloak access token's `ga4gh_visas` claim takes precedence. When that
 * claim is absent or invalid, the visas are fetched from the LS-AAI passport.
 */
export async function fetchGa4ghVisas(
  keycloakAccessToken?: string | null
): Promise<PassportFetchResult> {
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

  return fetchGa4ghPassport(token);
}
