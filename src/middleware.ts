// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    const keycloakLoginUrl = new URL(
      `${process.env.KEYCLOAK_ISSUER_URL}/protocol/openid-connect/auth`
    );
    keycloakLoginUrl.searchParams.append(
      "client_id",
      process.env.KEYCLOAK_CLIENT_ID!
    );
    keycloakLoginUrl.searchParams.append("redirect_uri", `/`);
    keycloakLoginUrl.searchParams.append("response_type", "code");
    keycloakLoginUrl.searchParams.append("scope", "openid profile email");

    return NextResponse.redirect(keycloakLoginUrl.toString());
  }

  return NextResponse.next();
}

export const config = { matcher: ["/requests", "/applications"] };
