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
// terminating reverse proxy it can look for the wrong cookie unless the
// request itself also signals HTTPS. OR'd with next-auth's own inference
// (rather than replacing it) so a correctly configured NEXTAUTH_URL/VERCEL
// still works even if a proxy fails to forward x-forwarded-proto.
function isSecureRequest(req: NextRequest) {
  // x-forwarded-proto may be a comma-separated list from a proxy chain;
  // the client-facing protocol is the first entry.
  const forwardedProto = req.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  return (
    forwardedProto === "https" ||
    req.nextUrl.protocol === "https:" ||
    !!process.env.NEXTAUTH_URL?.startsWith("https://") ||
    !!process.env.VERCEL
  );
}

export async function proxy(req: NextRequest) {
  const response = handleI18nRouting(req);

  if (!isProtectedPathname(req.nextUrl.pathname)) {
    return response;
  }

  const token = await getToken({ req, secureCookie: isSecureRequest(req) });

  if (!token) {
    // Next.js requires an absolute Location. Use the configured public URL
    // rather than an internal upstream host or untrusted forwarded headers.
    const signInUrl = new URL("/login", process.env.NEXTAUTH_URL || req.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      `${req.nextUrl.pathname}${req.nextUrl.search}`
    );
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
