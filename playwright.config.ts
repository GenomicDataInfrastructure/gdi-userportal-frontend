// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

const defaultMode = "mocked";
const e2eMode = process.env.E2E_MODE ?? defaultMode;
const isMocked = e2eMode === "mocked";
const appPort = Number(process.env.E2E_APP_PORT || 3000);
const mockApiPort = Number(process.env.MOCK_API_PORT || 4010);

process.env.E2E_MODE = e2eMode;

// Load E2E test env vars
dotenv.config({ path: ".env.e2e.test" });

if (isMocked) {
  process.env.NEXT_PUBLIC_DDS_URL = `http://localhost:${mockApiPort}`;
  process.env.NEXT_PUBLIC_DAAM_URL = `http://localhost:${mockApiPort}`;
}

const serverEnv = {
  ...process.env,
  MOCK_API_PORT: String(mockApiPort),
  PORT: String(appPort),
  E2E_DIST_DIR: ".next-e2e",
  // Explicitly override values that .env.local may set, to ensure mocked tests
  // always use the local mock infrastructure.
  ...(isMocked
    ? {
        ALLOW_LOCALHOST_JKU: "true",
        SKIP_VISA_SIGNATURE_VERIFICATION: "true",
        KEYCLOAK_ISSUER_URL: `http://localhost:${mockApiPort}`,
        LS_AAI_USERINFO_URL: `http://localhost:${mockApiPort}/userinfo`,
        TRUSTED_VISA_ISSUERS: `http://localhost:${mockApiPort}`,
        DISCOVERY_PROVIDER: "dds",
        NOTIFICATION_PROVIDER: "noop",
        NEXTAUTH_URL: `http://localhost:${appPort}`,
        NEXT_PUBLIC_SHOW_SERVICES: "true",
        NEXT_PUBLIC_FEATURE_CONTACT_US: "true",
        NEXT_PUBLIC_FEATURE_APPLICATION_OPTIONS: "true",
        NEXT_PUBLIC_SHOW_ALLELE_FREQUENCY: "true",
        NEXT_PUBLIC_SHOW_BASKET_AND_LOGIN: "true",
        NEXT_PUBLIC_ENABLE_MULTILINGUAL:
          process.env.E2E_MULTILINGUAL || "false",
        HARVEST_LOGGING_ENABLED: "true",
        OPENSEARCH_URL: `http://localhost:${mockApiPort}`,
        OPENSEARCH_HARVESTER_LOGS_INDEX: "harvester_logs",
      }
    : {}),
};

const webServers = [
  ...(isMocked
    ? [
        {
          command: "node tests/mocks/mock-api-server.js",
          url: `http://localhost:${mockApiPort}/health`,
          timeout: 120 * 1000,
          reuseExistingServer: !process.env.CI,
          env: serverEnv,
        },
      ]
    : []),
  {
    command: "npm run dev",
    url: `http://localhost:${appPort}`,
    timeout: 120 * 1000,
    // In mocked mode, always start fresh so serverEnv overrides .env.local
    reuseExistingServer: !isMocked,
    env: serverEnv,
  },
];
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  // Accessibility has its own browser/locale matrix and isolated mock state.
  testIgnore: "**/accessibility*.spec.ts",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],

  webServer: webServers,
  use: {
    baseURL: `http://localhost:${appPort}`,
  },
});
