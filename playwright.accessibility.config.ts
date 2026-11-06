// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: "**/accessibility*.spec.ts",
  testIgnore: [],
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  webServer: (Array.isArray(base.webServer)
    ? base.webServer
    : base.webServer
      ? [base.webServer]
      : []
  ).map((server) => ({
    ...server,
    env: {
      ...server.env,
      NEXT_PUBLIC_LINKEDIN_URL:
        "https://www.linkedin.com/company/gdi-euproject/",
      NEXT_PUBLIC_TWITTER_URL: "https://twitter.com/GDI_EUproject",
      NEXT_PUBLIC_GITHUB_URL: "https://github.com/GenomicDataInfrastructure",
      NEXT_PUBLIC_GITLAB_URL: "https://gitlab.com/gdi-accessibility-test",
      NEXT_PUBLIC_WEBSITE_URL: "https://gdi.onemilliongenomes.eu/",
    },
  })),
  use: {
    ...base.use,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      metadata: { language: "en" },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      metadata: { language: "en" },
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 900 },
      },
      metadata: { language: "en" },
    },
  ],
});
