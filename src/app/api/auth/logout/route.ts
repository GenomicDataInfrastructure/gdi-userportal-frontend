// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getServerSession } from 'next-auth';
import { getToken } from '../auth';
import { authOptions } from '../config';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    const idToken = await getToken('id_token');
    const url = `${process.env.END_SESSION_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL!)}`;

    try {
      await fetch(url);
    } catch (err) {
      console.error(`Could not log out from Keycloak`, err);
      return new Response(null, { status: 500 });
    }
  }
  return new Response(null, { status: 200 });
}
