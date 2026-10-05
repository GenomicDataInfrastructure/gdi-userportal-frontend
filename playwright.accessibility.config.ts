// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig(base, {
  testMatch: "**/accessibility*.spec.ts",
  testIgnore: [],
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
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
    {
      name: "french",
      testMatch: "**/accessibility.spec.ts",
      use: { ...devices["Desktop Chrome"] },
      metadata: { language: "fr" },
    },
    {
      name: "french-mobile",
      testMatch: "**/accessibility.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 900 },
      },
      metadata: { language: "fr" },
    },
  ],
});
