// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { getToken } from "@/app/api/auth/auth";

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
    throw new Error("Missing required environment variable: KEYCLOAK_ISSUER_URL");
  }
  const brokerUrl = `${keycloakIssuerUrl}/broker/LSAAI/token`;

  const response = await fetch(brokerUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${keycloakAccessToken}`,
    },
    cache: "no-store",
  });

  const data: LsAaiTokenResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      `LS-AAI token exchange failed: ${response.status} ${data.error ?? response.statusText}`
    );
  }

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
 * @returns Array of raw GA4GH Passport JWTs from the `ga4gh_passport_v1` claim.
 * @throws If the userinfo request fails with a non-OK status.
 */
async function fetchPassportFromLsAai(
  lsAaiAccessToken: string
): Promise<string[]> {
  const userinfoUrl = process.env.LS_AAI_USERINFO_URL;
  if (!userinfoUrl) {
    throw new Error("Missing required environment variable: LS_AAI_USERINFO_URL");
  }

  const response = await fetch(userinfoUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lsAaiAccessToken}`,
    },
    cache: "no-store",
  });

  const data: UserinfoResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      `LS-AAI userinfo request failed: ${response.status} ${data.error ?? response.statusText}`
    );
  }

  return data.ga4gh_passport_v1 ?? [];
}

/**
 * Fetches the GA4GH Passport for the current user via a two-step flow:
 *  1. Exchange the Keycloak access token for an LS-AAI access token.
 *  2. Call the LS-AAI userinfo endpoint to retrieve `ga4gh_passport_v1`.
 *
 * @returns Array of raw Passport JWTs, or an empty array if the user is
 *   unauthenticated.
 * @throws If either the token exchange or the userinfo request fails.
 */
export async function fetchGa4ghPassport(): Promise<string[]> {
  const keycloakAccessToken = await getToken("access_token");

  if (!keycloakAccessToken) {
    return [];
  }

  const lsAaiAccessToken =
    await exchangeKeycloakTokenForLsAai(keycloakAccessToken);

  return fetchPassportFromLsAai(lsAaiAccessToken);
}
