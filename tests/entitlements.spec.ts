// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "./fixtures/mockApi";
import { encode } from "next-auth/jwt";
import type { Page } from "@playwright/test";
import { mockAccessToken, setVisaScenario } from "./fixtures/visaScenario";

const isMocked = process.env.E2E_MODE === "mocked";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Creates a NextAuth JWT cookie that passes both:
 *  - The middleware `getToken` check (requires a valid signed JWT)
 *  - The session callback (requires `access_token` and `id_token` so the
 *    server-side token flow can use the Keycloak credentials)
 */
async function setAuthCookie(page: Page) {
  const secret = process.env.NEXTAUTH_SECRET || "your-secret";

  const fakeKeycloakToken = mockAccessToken(page);
  const fakeIdToken = "fake-id-token";

  const token = await encode({
    token: {
      name: "Test User",
      email: "test@example.com",
      sub: "test-user",
      // Raw (unencrypted) values — the session callback will encrypt them.
      access_token: fakeKeycloakToken,
      id_token: fakeIdToken,
      // Set expires_at far in the future so the jwt callback doesn't try to
      // refresh the token.
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    },
    secret,
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
}

/**
 * Keep a valid session with an empty access token to exercise the
 * passport-unavailable state without requiring a real Keycloak credential.
 */
async function setAuthCookieWithoutTokens(page: Page) {
  const secret = process.env.NEXTAUTH_SECRET || "your-secret";
  const token = await encode({
    token: {
      name: "Test User",
      email: "test@example.com",
      sub: "test-user",
      access_token: "",
      id_token: "fake-id-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    },
    secret,
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
}

const setScenario = setVisaScenario;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Entitlements page (GA4GH Passport flow)", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!isMocked, "Mocked-only tests");
    await setAuthCookie(page);
    await setScenario(page, "default");
  });

  test("shows entitlement card with dataset title", async ({ page }) => {
    await page.goto("/requests?tab=entitlements");

    await expect(page.getByText(/cancer cohort study/i)).toBeVisible({
      timeout: 15000,
    });
  });

  test("keeps concurrent passport scenarios isolated between sessions", async ({
    browser,
    baseURL,
  }) => {
    const contexts = await Promise.all(
      ["fallback", "multiple", "authorized"].map(() =>
        browser.newContext({ baseURL })
      )
    );
    try {
      const pages = await Promise.all(
        contexts.map((context) => context.newPage())
      );
      await Promise.all(pages.map((page) => setAuthCookie(page)));
      // Set every scenario before navigating: a global scenario would make all
      // three sessions receive whichever value was written last.
      await Promise.all(
        pages.map((page, index) =>
          setScenario(page, ["fallback", "multiple", "authorized"][index])
        )
      );
      await Promise.all(
        pages.map((page) => page.goto("/requests?tab=entitlements"))
      );
      await Promise.all([
        expect(pages[0].getByText(/unknown-dataset-id-999/i)).toBeVisible({
          timeout: 15000,
        }),
        expect(pages[1].getByText(/rare disease genomes/i)).toBeVisible({
          timeout: 15000,
        }),
        expect(
          pages[2].getByText(/do not have any active entitlements/i)
        ).toBeVisible({ timeout: 15000 }),
      ]);
    } finally {
      await Promise.all(contexts.map((context) => context.close()));
    }
  });

  test("shows source and granted-by label on entitlement card", async ({
    page,
  }) => {
    await page.goto("/requests?tab=entitlements");

    await expect(
      page.getByText(/granted by: REMS \| source: ckan/i)
    ).toBeVisible({ timeout: 15000 });
  });

  test("shows start and end dates on entitlement card", async ({ page }) => {
    await page.goto("/requests?tab=entitlements");

    await expect(page.getByText(/start:/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/end:/i)).toBeVisible();
  });

  test("shows all cards when multiple entitlements are returned", async ({
    page,
  }) => {
    await setScenario(page, "multiple");
    await page.goto("/requests?tab=entitlements");

    await expect(page.getByText(/cancer cohort study/i)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(/rare disease genomes/i)).toBeVisible();
    await expect(
      page.getByText(/granted by: REMS \| source: ckan/i)
    ).toBeVisible();
    await expect(
      page.getByText(/granted by: DAC \| source: rems/i)
    ).toBeVisible();
  });

  test("shows fallback card when dataset cannot be resolved from catalog", async ({
    page,
  }) => {
    await setScenario(page, "fallback");
    await page.goto("/requests?tab=entitlements");

    await expect(page.getByText(/unknown-dataset-id-999/i)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(/granted by.*DAC/i)).toBeVisible();
    await expect(page.getByText(/source.*rems/i)).toBeVisible();
  });

  test("shows no-valid-grants state when passport is present but visas are empty", async ({
    page,
  }) => {
    await setScenario(page, "empty");
    await page.goto("/requests?tab=entitlements");

    await expect(
      page.getByText(/do not have any active entitlements/i)
    ).toBeVisible({ timeout: 15000 });
  });

  test("shows passport-unavailable banner when access token is missing", async ({
    page,
  }) => {
    // Override the cookie with an authenticated session without a usable token.
    await page.context().clearCookies();
    await setAuthCookieWithoutTokens(page);
    await page.goto("/requests?tab=entitlements");

    await expect(page.getByText(/ga4gh passport is unavailable/i)).toBeVisible({
      timeout: 15000,
    });
  });
});
