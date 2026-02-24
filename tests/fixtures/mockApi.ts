// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { test as base, expect, Page, Route } from "@playwright/test";
import mockData from "../mocks/discovery.json";

const isMocked = process.env.E2E_MODE === "mocked";
const filterValuesByKey = mockData.filterValuesByKey as Record<
  string,
  (typeof mockData.filterValuesByKey)[keyof typeof mockData.filterValuesByKey]
>;
const datasetDetailsById = mockData.datasetDetailsById as Record<
  string,
  (typeof mockData.datasetDetailsById)[keyof typeof mockData.datasetDetailsById]
>;

const fulfillJson = async (route: Route, payload: unknown) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
};

const setupMockApiRoutes = async (page: Page) => {
  await page.route("**/api/v1/filters", async (route) => {
    await fulfillJson(route, mockData.filters);
  });

  await page.route(/\/api\/v1\/filters\/[^/]+\/values$/, async (route) => {
    const url = route.request().url();
    const match = url.match(/\/api\/v1\/filters\/([^/]+)\/values$/);
    const key = match ? decodeURIComponent(match[1]) : "";
    const values = filterValuesByKey[key] || [];
    await fulfillJson(route, values);
  });

  await page.route("**/api/v1/datasets/search", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }
    await fulfillJson(route, mockData.datasetSearchResponse);
  });

  await page.route(/\/api\/v1\/datasets\/[^/]+$/, async (route) => {
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }
    const url = route.request().url();
    const match = url.match(/\/api\/v1\/datasets\/([^/]+)$/);
    const id = match ? decodeURIComponent(match[1]) : "";
    const dataset =
      datasetDetailsById[id] ||
      mockData.datasetSearchResponse.results.find((item) => item.id === id);

    if (dataset) {
      await fulfillJson(route, dataset);
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ message: "Dataset not found", id }),
    });
  });
};

const test = base.extend({
  page: async ({ page }, runFixture) => {
    if (isMocked) {
      await setupMockApiRoutes(page);
    }
    await runFixture(page);
  },
});

export { test, expect };
