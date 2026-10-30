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
    `^/(?:(?:${routing.locales.join("|")})/)?(?:requests|applications)(?:/.*)?$`
  ).test(pathname);
}

// next-auth's getToken() only infers the secure (`__Secure-`-prefixed) cookie
// name from NEXTAUTH_URL/VERCEL, not from the request, so behind a TLS
// terminating reverse proxy it can look for the wrong cookie unless told
// explicitly that the original request was HTTPS.
function isSecureRequest(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-proto") === "https" ||
    req.nextUrl.protocol === "https:"
  );
}

export async function proxy(req: NextRequest) {
  const response = handleI18nRouting(req);

  if (!isProtectedPathname(req.nextUrl.pathname)) {
    return response;
  }

  const token = await getToken({ req, secureCookie: isSecureRequest(req) });

  if (!token) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
