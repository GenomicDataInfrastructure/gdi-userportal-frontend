// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

const defaultMode = "mocked";
const e2eMode = process.env.E2E_MODE ?? defaultMode;
const isMocked = e2eMode === "mocked";
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
    url: "http://localhost:3000",
    timeout: 120 * 1000,
    reuseExistingServer: true,
    env: serverEnv,
  },
];
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
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
    baseURL: "http://localhost:3000",
  },
});
