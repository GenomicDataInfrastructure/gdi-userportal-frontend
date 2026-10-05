// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import type { Page } from "@playwright/test";
import { encode } from "next-auth/jwt";

export const authenticate = async (page: Page) => {
  const token = await encode({
    token: {
      sub: "e2e-test-user",
      name: "E2E Test User",
      email: "e2e@example.com",
      access_token: "e2e-test-access-token",
      id_token: "e2e-test-id-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret",
    maxAge: 3600,
  });

  await page.context().addCookies([
    {
      name: "next-auth.session-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
};
