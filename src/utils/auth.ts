// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { encrypt } from '@/utils/encryption';
import { jwtDecode } from 'jwt-decode';
import type { NextAuthOptions, Session } from 'next-auth';
import { Account, getServerSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Keycloack from 'next-auth/providers/keycloak';
import { signOut } from 'next-auth/react';
import { decrypt } from './encryption';

export type ExtendedSession = Session & { id_token: string; access_token: string; error?: string };

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
      authorization: { params: { scope: 'openid profile email' } },
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

export async function getToken(tokenType: 'access_token' | 'id_token') {
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  if (session) {
    const tokenDecrypted = decrypt(session[tokenType]!);
    return tokenDecrypted;
  }
  return null;
}

export function completeTokenWithAccountInfo(token: JWT, account: Account): JWT {
  return {
    ...token,
    decoded: jwtDecode(account.access_token!) as string,
    access_token: account.access_token as string,
    id_token: account.id_token as string,
    refresh_token: account.refresh_token as string,
    expires_at: account.expires_at as number,
  };
}

export async function refreshAccessToken(token: JWT) {
  const response = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: `${process.env.KEYCLOAK_CLIENT_ID}`,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token as string,
    }),
    method: 'POST',
  });
  const refreshToken = await response.json();
  if (!response.ok) throw refreshToken;

  return {
    ...token,
    access_token: refreshToken.access_token,
    id_token: refreshToken.id_token,
    decoded: jwtDecode(refreshToken.access_token),
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
  };
}

export async function keycloackSessionLogOut() {
  try {
    await fetch('/api/auth/logout');
  } catch (error) {
    throw new Error(`Could not log out from Keycloak: ${error}`);
  }
}

export function logOutIfSessionError(session: ExtendedSession | null, status: string) {
  if (session && status !== 'loading' && session?.error) {
    signOut({ callbackUrl: '/' });
  }
}
