// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "./fixtures/mockApi";

const isMocked = process.env.E2E_MODE === "mocked";

const shouldIgnoreConsoleError = (text: string) => {
  const ignoredPatterns = [
    /content security policy/i,
    /content-security-policy/i,
    /style-src-elem/i,
    /style-src 'self'/i,
    /fonts\.googleapis\.com/i,
  ];
  return ignoredPatterns.some((pattern) => pattern.test(text));
};

test("Homepage renders correctly and loads dynamic content", async ({
  page,
}) => {
  test.skip(!isMocked, "Mocked-only test");

  // Capture console errors (useful for backend/data fetch failures)
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const message = msg.text();
      if (!shouldIgnoreConsoleError(message)) {
        consoleErrors.push(message);
      }
    }
  });

  await page.goto("/");

  // Homepage title and subtitle
  await expect(page.locator("h1")).toContainText(/welcome/i);
  await expect(
    page.getByRole("heading", { name: /genomic data/i })
  ).toBeVisible();

  // Search bar should be visible
  await expect(page.getByRole("textbox")).toBeVisible();

  // "About the data portal" section should be visible
  const aboutHeading = page.getByRole("heading", {
    name: /about the data portal/i,
  });
  await expect(aboutHeading).toBeVisible();
  const aboutSection = aboutHeading.locator("..");
  await expect(
    aboutSection.getByRole("link", { name: /read more/i })
  ).toHaveAttribute("href", "/about");

  // ValueList renders with "Themes"
  const themesTitle = page.locator("h3", { hasText: "Themes" });
  if (await themesTitle.count()) {
    await expect(themesTitle).toBeVisible();
  }

  // Most Recent Datasets section shows up
  await expect(
    page.getByRole("heading", { name: /most recent datasets/i })
  ).toBeVisible();

  // No console errors occurred (e.g. fetch failures)
  expect(consoleErrors).toHaveLength(0);
});
