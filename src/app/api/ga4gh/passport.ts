// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { getToken } from "@/app/api/auth/auth";

/** Maximum time to wait for any single fetch in the passport pipeline. */
const FETCH_TIMEOUT_MS = 10_000;

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

  let response: Response;
  try {
    response = await fetch(brokerUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${keycloakAccessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error("LS-AAI broker endpoint timed out");
    }
    throw new Error("LS-AAI broker endpoint unreachable");
  }

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

  let response: Response;
  try {
    response = await fetch(userinfoUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lsAaiAccessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error("LS-AAI userinfo endpoint timed out");
    }
    throw new Error("LS-AAI userinfo endpoint unreachable");
  }

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
export async function fetchGa4ghPassport(): Promise<PassportFetchResult> {
  const keycloakAccessToken = await getToken("access_token");

  if (!keycloakAccessToken) {
    return { visaJwts: [], passportPresent: false };
  }

  const lsAaiAccessToken =
    await exchangeKeycloakTokenForLsAai(keycloakAccessToken);

  return fetchPassportFromLsAai(lsAaiAccessToken);
}

