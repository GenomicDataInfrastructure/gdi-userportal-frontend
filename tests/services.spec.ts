// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "./fixtures/mockApi";

const isMocked = process.env.E2E_MODE === "mocked";

test("user explores the available services", async ({ page }) => {
  test.skip(!isMocked, "Mocked-only E2E test");
  await page.goto("/services");

  const discoveryService = page.getByRole("button", {
    name: /Dataset Discovery Service/i,
  });
  await expect(discoveryService).toBeVisible();
  await discoveryService.click();
  await expect(discoveryService).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("heading", { name: /key features/i })
  ).toBeVisible();
});
