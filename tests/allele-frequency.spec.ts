// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures/mockApi";
import { authenticate } from "./fixtures/authenticate";

const isMocked = process.env.E2E_MODE === "mocked";

const selectGenome = async (page: Page) => {
  await expect(async () => {
    await page.getByRole("combobox").first().selectOption("GRCh38");
    await expect(page.getByRole("textbox").first()).toBeVisible({
      timeout: 1_000,
    });
  }).toPass();
};

test("researcher searches for an allele frequency", async ({ page }) => {
  test.skip(!isMocked, "Mocked-only E2E test");
  await authenticate(page);
  await page.goto("/allele-frequency");

  await selectGenome(page);
  await page.getByRole("textbox").first().fill("15-101055236-G-A");
  await page.getByRole("button", { name: /^search$/i }).click();

  await expect(page.getByRole("table").first()).toBeVisible();
  await expect(page.getByText("Synthetic Beacon").first()).toBeVisible();
});
