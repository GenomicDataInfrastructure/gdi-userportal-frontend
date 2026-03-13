// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

type OidcTokenResponse = {
  access_token: string;
  expires_in?: number;
  token_type?: string;
};

const formatErrorDetails = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const details = [error.message];
  const cause = error.cause;

  if (
    cause instanceof Error &&
    cause.message &&
    cause.message !== error.message
  ) {
    details.push(`cause: ${cause.message}`);
  }

  return details.join(" | ");
};

export class OidcAuthService {
  private accessToken: string | null = null;
  private tokenExpiryEpochMs: number | null = null;

  private get config() {
    return {
      tokenUrl: process.env.HARVEST_OIDC_TOKEN_URL,
      clientId: process.env.HARVEST_OIDC_CLIENT_ID,
      clientSecret: process.env.HARVEST_OIDC_CLIENT_SECRET,
    };
  }

  private hasAnyConfig(): boolean {
    const { tokenUrl, clientId, clientSecret } = this.config;
    return Boolean(tokenUrl || clientId || clientSecret);
  }

  private hasRequiredConfig(): boolean {
    const { tokenUrl, clientId, clientSecret } = this.config;
    return Boolean(tokenUrl && clientId && clientSecret);
  }

  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiryEpochMs) return false;
    return Date.now() < this.tokenExpiryEpochMs;
  }

  private async requestAccessToken(): Promise<string> {
    const { tokenUrl, clientId, clientSecret } = this.config;

    if (!tokenUrl || !clientId || !clientSecret) {
      throw new Error(
        "Missing HARVEST_OIDC_TOKEN_URL/HARVEST_OIDC_CLIENT_ID/HARVEST_OIDC_CLIENT_SECRET"
      );
    }

    const body = new URLSearchParams();
    body.set("grant_type", "client_credentials");
    body.set("client_id", clientId);
    body.set("client_secret", clientSecret);

    let response: Response;
    try {
      response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
    } catch (error) {
      throw new Error(
        `Failed to retrieve OIDC access token from ${tokenUrl}: ${formatErrorDetails(error)}`
      );
    }

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve OIDC access token from ${tokenUrl} (${response.status} ${response.statusText})`
      );
    }

    const payload = (await response.json()) as OidcTokenResponse;
    if (!payload.access_token) {
      throw new Error("OIDC token response missing access_token");
    }

    const expiresInSec = payload.expires_in ?? 300;
    this.accessToken = payload.access_token;
    this.tokenExpiryEpochMs =
      Date.now() + Math.max(30, expiresInSec - 30) * 1000;

    return this.accessToken;
  }

  async getAuthorizationHeaderIfConfigured(): Promise<Record<string, string>> {
    if (!this.hasAnyConfig()) {
      return {};
    }

    if (!this.hasRequiredConfig()) {
      throw new Error(
        "Incomplete OIDC configuration for harvesting. Provide HARVEST_OIDC_TOKEN_URL, HARVEST_OIDC_CLIENT_ID and HARVEST_OIDC_CLIENT_SECRET."
      );
    }

    if (!this.isTokenValid()) {
      await this.requestAccessToken();
    }

    return { Authorization: `Bearer ${this.accessToken}` };
  }
}

export const oidcAuthService = new OidcAuthService();
