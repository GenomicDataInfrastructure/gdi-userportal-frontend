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

test("Dataset list renders filters and results", async ({ page }) => {
  test.skip(!isMocked, "Mocked-only test");

  // Listen for unexpected errors
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const message = msg.text();
      if (!shouldIgnoreConsoleError(message)) {
        consoleErrors.push(message);
      }
    }
  });

  await page.goto("/datasets?page=1");

  // Search bar
  await expect(page.getByRole("textbox")).toBeVisible();

  // Filters
  const themeFilterButton = page.getByRole("button", { name: /theme/i });
  await expect(themeFilterButton).toBeVisible({ timeout: 15000 });
  await themeFilterButton.click();
  await page.getByLabel("Oncology").check();
  const datasetSeriesFilterButton = page.getByRole("button", {
    name: /dataset series/i,
  });
  await expect(datasetSeriesFilterButton).toBeVisible();
  await datasetSeriesFilterButton.click();
  await page.getByLabel("Colorectal cohort").check();

  await expect(
    page.getByRole("heading", { name: /active filters/i })
  ).toBeVisible();
  await expect(page.getByText(/theme\s*:\s*oncology/i)).toBeVisible();
  await expect(
    page.getByText(/dataset series\s*:\s*colorectal cohort/i)
  ).toBeVisible();

  // Dataset list
  await expect(
    page.getByRole("link", { name: /cancer cohort study/i })
  ).toBeVisible();
  const seriesCard = page.getByRole("link", {
    name: /pan-cancer longitudinal series/i,
  });
  await expect(seriesCard).toBeVisible();
  await expect(seriesCard.getByText(/dataset series/i)).toBeVisible();
  await expect(page.getByText(/1 dataset series/i)).toBeVisible();
  await expect(page.getByText(/externally governed/i)).toBeVisible();

  // 6. Ensure there are no console errors
  expect(consoleErrors).toHaveLength(0);
});
