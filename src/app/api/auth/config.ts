// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { encrypt } from "@/utils/encryption";
import { keycloackSessionLogOut } from "@/utils/logout";
import type { NextAuthOptions } from "next-auth";
import Keycloack from "next-auth/providers/keycloak";
import { signOut } from "next-auth/react";
import { completeTokenWithAccountInfo, refreshAccessToken } from "./auth";
import { JWTCallbackEntry, SessionCallbackEntry } from "./types/auth.types";

type DecodedTokenRoles = {
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};

function extractRoles(decodedToken: DecodedTokenRoles): string[] {
  const realmRoles = decodedToken.realm_access?.roles ?? [];
  const resourceAccess = decodedToken.resource_access ?? {};
  const configuredClientId = process.env.KEYCLOAK_CLIENT_ID;

  const configuredClientRoles = configuredClientId
    ? resourceAccess[configuredClientId]?.roles ?? []
    : [];

  const allClientRoles = Object.values(resourceAccess).flatMap(
    (clientAccess) => clientAccess.roles ?? []
  );

  return Array.from(
    new Set([...realmRoles, ...configuredClientRoles, ...allClientRoles])
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    Keycloack({
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: process.env.KEYCLOAK_ISSUER_URL,
      authorization: {
        params: {
          scope:
            process.env.KEYCLOAK_CLIENT_SCOPE ??
            "openid profile email elixir_id",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: JWTCallbackEntry) {
      const currTimestamp = Math.floor(Date.now() / 1000);
      const isTokenExpired = (token?.expires_at as number) - 60 < currTimestamp;

      if (account) {
        return completeTokenWithAccountInfo(token, account);
      } else if (isTokenExpired) {
        try {
          const refreshedToken = await refreshAccessToken(token);
          return refreshedToken;
        } catch (error) {
          console.error(error);
          keycloackSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
          throw new Error("Could not refresh the token. Logging out...");
        }
      } else {
        return token;
      }
    },

    async session({ session, token }: SessionCallbackEntry) {
      const decodedToken = (token.decoded ?? {}) as DecodedTokenRoles;

      return {
        ...session,
        access_token: encrypt(token.access_token as string),
        id_token: encrypt(token.id_token as string),
        roles: extractRoles(decodedToken),
        error: token.error,
      };
    },
  },
};
