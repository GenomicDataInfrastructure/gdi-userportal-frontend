// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "@playwright/test";

test("Homepage renders correctly and loads dynamic content", async ({
  page,
}) => {
  // Capture console errors (useful for backend/data fetch failures)
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
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
  await expect(
    page.getByRole("heading", { name: /about the data portal/i })
  ).toBeVisible();
  await expect(page.getByText("Read more")).toBeVisible();
  await expect(page.getByRole("link", { name: /read more/i })).toHaveAttribute(
    "href",
    "/about"
  );

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
