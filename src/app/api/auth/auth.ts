// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { decrypt } from '@/utils/encryption';
import { jwtDecode } from 'jwt-decode';
import { Account, getServerSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { ExtendedSession } from './auth.types';
import { authOptions } from './config';

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
      client_secret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token as string,
    }),
    method: 'POST',
    cache: 'no-cache',
  });
  const refreshToken = await response.json();

  return {
    ...token,
    access_token: refreshToken.access_token,
    id_token: refreshToken.id_token,
    decoded: jwtDecode(refreshToken.access_token),
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
  };
}
