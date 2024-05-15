// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { encrypt } from '@/utils/encryption';
import { keycloackSessionLogOut } from '@/utils/logout';
import type { NextAuthOptions } from 'next-auth';
import Keycloack from 'next-auth/providers/keycloak';
import { signOut } from 'next-auth/react';
import { completeTokenWithAccountInfo, refreshAccessToken } from './auth';
import { JWTCallbackEntry, SessionCallbackEntry } from './auth.types';

export const authOptions: NextAuthOptions = {
  providers: [
    Keycloack({
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: process.env.KEYCLOAK_ISSUER_URL,
      authorization: { params: { scope: 'openid profile email elixir_id' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: JWTCallbackEntry) {
      const currTimestamp = Math.floor(Date.now() / 1000);
      const isTokenExpired = (token?.expires_at as number) < currTimestamp;

      if (account) {
        return completeTokenWithAccountInfo(token, account);
      } else if (isTokenExpired) {
        try {
          const refreshedToken = await refreshAccessToken(token);
          return refreshedToken;
        } catch (error) {
          keycloackSessionLogOut().then(() => signOut({ callbackUrl: '/' }));
          throw new Error('Could not refresh the token. Logging out...');
        }
      } else {
        return token;
      }
    },

    async session({ session, token }: SessionCallbackEntry) {
      return {
        ...session,
        access_token: encrypt(token.access_token as string),
        id_token: encrypt(token.id_token as string),
        roles: (token.decoded as { realm_access?: { roles?: string[] } }).realm_access?.roles,
        error: token.error,
      };
    },
  },
};
