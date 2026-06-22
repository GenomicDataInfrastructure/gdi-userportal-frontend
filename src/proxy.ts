// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { routing } from "@/i18n/routing";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

function isProtectedPathname(pathname: string) {
  return new RegExp(
    `^/(?:${routing.locales.join("|")})/(?:requests|applications)(?:/.*)?$`
  ).test(pathname);
}

export async function proxy(req: NextRequest) {
  const response = handleI18nRouting(req);

  if (response.headers.get("location")) {
    return response;
  }

  if (!isProtectedPathname(req.nextUrl.pathname)) {
    return response;
  }

  const token = await getToken({ req });

  if (!token) {
    const keycloakLoginUrl = new URL(
      `${process.env.KEYCLOAK_ISSUER_URL}/protocol/openid-connect/auth`
    );
    keycloakLoginUrl.searchParams.append(
      "client_id",
      process.env.KEYCLOAK_CLIENT_ID!
    );
    keycloakLoginUrl.searchParams.append(
      "redirect_uri",
      `${req.nextUrl.pathname}${req.nextUrl.search}`
    );
    keycloakLoginUrl.searchParams.append("response_type", "code");
    keycloakLoginUrl.searchParams.append("scope", "openid profile email");

    return NextResponse.redirect(keycloakLoginUrl.toString());
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
