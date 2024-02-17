// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { completeTokenWithAccountInfo, refreshAccessToken } from '@/utils/auth';
import { encrypt } from '@/utils/encryption';
import type { NextAuthOptions, Session } from 'next-auth';
import { Account } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';
import Keycloack from 'next-auth/providers/keycloak';

type JWTCallbackEntry = {
  token: JWT;
  account: Account | null;
};

type SessionCallbackEntry = {
  token: JWT;
  session: Session;
};

export const authOptions: NextAuthOptions = {
  providers: [
    Keycloack({
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: process.env.KEYCLOAK_ISSUER_URL,
      authorization: { params: { scope: 'openid profile email offline_access' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: JWTCallbackEntry) {
      const currTimestamp = Math.floor(Date.now() / 1000);
      const isTokenExpired = token?.expires_at && (token?.expires_at as number) <= currTimestamp;

      if (account) {
        return completeTokenWithAccountInfo(token, account);
      } else if (!isTokenExpired) {
        return token;
      } else {
        try {
          const refreshedToken = await refreshAccessToken(token);
          return refreshedToken;
        } catch (error) {
          return { ...token, error: 'RefreshAccessTokenError' };
        }
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
