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

export async function proxy(req: NextRequest) {
  const response = handleI18nRouting(req);

  if (!isProtectedPathname(req.nextUrl.pathname)) {
    return response;
  }

  const token = await getToken({ req });

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
