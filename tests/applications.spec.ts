// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "./fixtures/mockApi";
import { authenticate } from "./fixtures/authenticate";

const isMocked = process.env.E2E_MODE === "mocked";
const mockOrigin = `http://localhost:${process.env.MOCK_API_PORT || 4010}`;

test.describe("applications", () => {
  test.beforeEach(() => test.skip(!isMocked, "Mocked-only E2E test"));

  test("applicant submits a completed application with accepted terms", async ({
    page,
    browserName,
  }) => {
    const applicationId = browserName === "firefox" ? 91 : 89;
    await authenticate(page);
    await page.goto(`/applications/${applicationId}`);

    await expect(
      page.getByRole("heading", {
        name: new RegExp(`application E2E-${applicationId}`, "i"),
      })
    ).toBeVisible();
    await expect(
      page.getByText(/^accepted$/i).filter({ visible: true })
    ).toBeVisible();

    await page.getByRole("button", { name: /^submit$/i }).click();
    await expect
      .poll(async () => {
        const response = await page.request.get(
          `${mockOrigin}/_test/e2e/applications/${applicationId}`
        );
        return (await response.json()).state;
      })
      .toBe("application.state/submitted");
    await page.reload();

    await expect(page.getByText(/^submitted$/i).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^submit$/i })
    ).toBeHidden();
  });

  test("applicant sees an application approved by the external approval service", async ({
    page,
    browserName,
  }) => {
    const applicationId = browserName === "firefox" ? 92 : 90;
    await authenticate(page);
    await page.goto(`/applications/${applicationId}`);

    await expect(page.getByText(/^approved$/i).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^submit$/i })
    ).toBeHidden();
  });
});
