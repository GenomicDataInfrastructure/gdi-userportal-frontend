// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jwtDecode } from 'jwt-decode';
import type { Session } from 'next-auth';
import { Account, getServerSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { signOut } from 'next-auth/react';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { decrypt } from './encryption';

type ExtendedSession = Session & { id_token: string; access_token: string; error?: string };

async function getToken(tokenType: 'access_token' | 'id_token') {
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  if (session) {
    const tokenDecrypted = decrypt(session[tokenType]!);
    return tokenDecrypted;
  }
  return null;
}

function completeTokenWithAccountInfo(token: JWT, account: Account): JWT {
  return {
    ...token,
    decoded: jwtDecode(account.access_token!) as string,
    access_token: account.access_token as string,
    id_token: account.id_token as string,
    refresh_token: account.refresh_token as string,
    expires_at: account.expires_at as number,
  };
}

async function refreshAccessToken(token: JWT) {
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

async function keycloackSessionLogOut() {
  try {
    await fetch('/api/auth/logout');
  } catch (error) {
    throw new Error(`Could not log out from Keycloak: ${error}`);
  }
}

function logOutIfSessionError(session: ExtendedSession | null, status: string) {
  if (session && status !== 'loading' && session?.error) {
    signOut({ callbackUrl: '/' });
  }
}

export { completeTokenWithAccountInfo, getToken, keycloackSessionLogOut, logOutIfSessionError, refreshAccessToken };
