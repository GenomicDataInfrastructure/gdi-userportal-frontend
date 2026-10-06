// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "./fixtures/mockApi";

const isMocked = process.env.E2E_MODE === "mocked";

test("user browses datasets by theme", async ({ page }) => {
  test.skip(!isMocked, "Mocked-only E2E test");
  await page.goto("/themes");

  await expect(
    page.getByRole("heading", { name: /^themes$/i }).filter({ visible: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Oncology" }).filter({ visible: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Genomics" }).filter({ visible: true })
  ).toBeVisible();
});
