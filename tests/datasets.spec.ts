// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "@playwright/test";

test("Dataset renders static and dynamic content correctly", async ({
  page,
}) => {
  // Listen for unexpected errors
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto("/");

  // Static content: main heading and subtitle
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /welcome/i
  );
  await expect(
    page.getByRole("heading", { name: /genomic data infrastructure/i })
  ).toBeVisible();

  // Search bar
  await expect(page.getByRole("textbox")).toBeVisible();

  // Themes section
  const themeCards = page.getByRole("heading", { level: 3 });
  const themeCardCount = await themeCards.count();
  expect(themeCardCount).toBeGreaterThan(0);

  // Assert that at least one theme card is visible
  await expect(themeCards.first()).toBeVisible();

  // Assert that at least one "See datasets" link exists in the ValueList section
  const seeDatasetLinks = page.getByRole("link", { name: /see datasets/i });
  await expect(seeDatasetLinks.first()).toBeVisible();

  // Most recent datasets section
  await expect(
    page.getByRole("heading", { name: /most recent datasets/i })
  ).toBeVisible();

  // Check if dataset cards are rendered
  const datasetCards = page.locator("h3.text-lg"); // matches <h3> in each dataset card
  const cardCount = await datasetCards.count();
  expect(cardCount).toBeGreaterThan(0);

  await expect(datasetCards.first()).toBeVisible();

  const datasetLinks = page.locator('a[href^="/datasets/"]');
  await expect(datasetLinks.first()).toHaveAttribute("href", /\/datasets\/.+/);

  // 6. Ensure there are no console errors
  expect(consoleErrors).toHaveLength(0);
});
