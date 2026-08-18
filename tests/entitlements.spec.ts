// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "./fixtures/mockApi";
import { encode } from "next-auth/jwt";
import Cryptr from "cryptr";
import type { Page } from "@playwright/test";

const isMocked = process.env.E2E_MODE === "mocked";
const mockApiPort = Number(process.env.MOCK_API_PORT || 4010);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Creates a NextAuth JWT cookie that passes both:
 *  - The middleware `getToken` check (requires a valid signed JWT)
 *  - The session callback (requires `access_token` and `id_token` so Cryptr
 *    does not throw, enabling `getToken("access_token")` to return a value
 *    that the GA4GH Passport flow can use)
 */
async function setAuthCookie(page: Page) {
  const secret = process.env.NEXTAUTH_SECRET || "your-secret";
  // The session callback calls encrypt(token.access_token) using NEXTAUTH_URL
  // as the Cryptr secret.  Pre-encrypt here so the raw token stored in the
  // NextAuth JWT matches what the session callback would produce.
  const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cryptr = new Cryptr(nextAuthUrl);

  const fakeKeycloakToken = "fake-keycloak-access-token";
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

  // Suppress unused variable warning — cryptr is imported for type purposes
  void cryptr;
}

/**
 * Cookie with a valid JWT but NO access_token / id_token.
 * The session callback will throw → getToken returns null
 * → fetchGa4ghPassport returns { passportPresent: false }.
 */
async function setAuthCookieWithoutTokens(page: Page) {
  const secret = process.env.NEXTAUTH_SECRET || "your-secret";
  const token = await encode({
    token: {
      name: "Test User",
      email: "test@example.com",
      sub: "test-user",
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

/** Tells the mock server which visa scenario to return from the userinfo endpoint. */
async function setScenario(page: Page, scenario: string) {
  await page.request.post(
    `http://localhost:${mockApiPort}/_test/set-scenario`,
    {
      data: JSON.stringify({ scenario }),
      headers: { "Content-Type": "application/json" },
    }
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Entitlements page (GA4GH Passport flow)", () => {
  // Must run serially — tests share mock server scenario state via
  // POST /_test/set-scenario, so parallel execution causes race conditions.
  test.describe.configure({ mode: "serial" });
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
      page.getByText(/no valid access grants were found/i)
    ).toBeVisible({ timeout: 15000 });
  });

  test("shows passport-unavailable banner when access token is missing", async ({
    page,
  }) => {
    // Override the cookie — no access_token so getToken returns null
    await page.context().clearCookies();
    await setAuthCookieWithoutTokens(page);
    await page.goto("/requests?tab=entitlements");

    await expect(page.getByText(/ga4gh passport unavailable/i)).toBeVisible({
      timeout: 15000,
    });
  });
});
