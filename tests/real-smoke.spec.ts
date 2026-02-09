// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "@playwright/test";

const isReal = process.env.E2E_MODE === "real";

test("Real backend smoke: homepage loads", async ({ page }) => {
  test.skip(!isReal, "Real-only test");

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("textbox")).toBeVisible();
});

test("Real backend smoke: datasets list and detail", async ({ page }) => {
  test.skip(!isReal, "Real-only test");

  await page.goto("/datasets?page=1");

  const countLocator = page.getByText(/dataset[s]? found/i);
  await expect(countLocator).toBeVisible({ timeout: 15000 });

  const countText = await countLocator.textContent();
  const count = Number(countText?.match(/\d+/)?.[0] ?? 0);

  if (!count) {
    return;
  }

  const datasetLink = page.locator('a[href^="/datasets/"]:not([href*="?"])');
  await expect(datasetLink.first()).toBeVisible({ timeout: 15000 });

  await datasetLink.first().click();
  await expect(page).toHaveURL(/\/datasets\/[^/?]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
    timeout: 15000,
  });
});

test("Real backend smoke: basket page", async ({ page }) => {
  test.skip(!isReal, "Real-only test");

  await page.goto("/datasets?page=1");

  const datasetLink = page.locator('a[href^="/datasets/"]:not([href*="?"])');
  if (await datasetLink.count()) {
    await datasetLink.first().click();

    const addButton = page.locator("a", { hasText: /add to basket/i });
    if (await addButton.count()) {
      await addButton.click();
    }
  }

  await page.goto("/basket");
  await expect(page.getByText(/your basket/i)).toBeVisible();
});
