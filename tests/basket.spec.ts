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

test("Basket flow adds dataset and shows it", async ({ page }) => {
  test.skip(!isMocked, "Mocked-only test");

  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const message = msg.text();
      if (!shouldIgnoreConsoleError(message)) {
        consoleErrors.push(message);
      }
    }
  });

  await page.goto("/datasets/ds-001");

  const addButton = page.locator("a:visible", {
    hasText: /add to basket/i,
  });
  await expect(addButton).toBeVisible();
  await expect(addButton).toHaveAttribute("aria-disabled", "false");
  await addButton.click();

  await page.goto("/basket");

  await expect(
    page.getByRole("heading", { name: /your basket/i })
  ).toBeVisible();
  await expect(page.getByText(/your basket\s*\(1\)/i)).toBeVisible();
  await expect(page.getByText(/cancer cohort study/i)).toBeVisible();
  await expect(
    page.locator("a", { hasText: /login to request/i })
  ).toBeVisible();

  expect(consoleErrors).toHaveLength(0);
});
