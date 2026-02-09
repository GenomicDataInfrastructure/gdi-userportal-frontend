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

test("Dataset detail renders metadata and distributions", async ({ page }) => {
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

  await expect(
    page.getByRole("heading", { name: /cancer cohort study/i })
  ).toBeVisible();
  await expect(page.getByText("GDI Core")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /health information/i })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /population & demographics/i })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /coverage/i })).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /links & references/i })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /version information/i })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /analytics/i })).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /dataset dictionary/i })
  ).toBeVisible();

  await expect(page.getByText("Clinical CSV Export")).toBeVisible();
  await page.getByText("Clinical CSV Export").click();
  await expect(
    page.getByText("De-identified clinical attributes.")
  ).toBeVisible();
  await expect(page.getByText("File Type:").first()).toBeVisible();

  expect(consoleErrors).toHaveLength(0);
});
