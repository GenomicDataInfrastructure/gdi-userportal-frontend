// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Page, TestInfo } from "@playwright/test";
import {
  test,
  expect,
  authenticate,
  expectNoAccessibilityViolations,
  language,
  message,
  url,
} from "./fixtures/accessibility";

// The same manifest generates the scans and the route coverage assertion.
const pages: {
  route: string;
  path?: string;
  auth?: boolean;
  scan?: boolean;
  ready: (page: Page, info: TestInfo) => Promise<void>;
}[] = [
  {
    route: "/",
    ready: async (page, info) => {
      await expect(
        page.getByRole("heading", {
          name: message("home.title", info),
          exact: true,
        })
      ).toBeVisible();
    },
  },
  ...[
    ["/about", /^about$/i],
    ["/howto", /how to use the genomic/i],
    ["/legal", /terms and conditions of/i],
  ].map(([route, heading]) => ({
    route: route as string,
    ready: async (page: Page) => {
      await expect(
        page.getByRole("heading", { name: heading as RegExp }).first()
      ).toBeVisible();
    },
  })),
  ...[
    ["/services", "services.title"],
    ["/themes", "themes.title"],
    ["/publishers", "publishers.title"],
    ["/allele-frequency", "alleleFrequency.searchForYourVariant"],
    ["/basket", "basket.title"],
    ["/notifications", "notifications.label"],
  ].map(([route, key]) => ({
    route,
    auth: route === "/notifications",
    ready: async (page: Page, info: TestInfo) => {
      await expect(
        page.getByRole("heading", {
          name: message(key as Parameters<typeof message>[0], info),
          exact: true,
        })
      ).toBeVisible();
      if (route === "/basket")
        await expect(
          page.getByText(message("basket.empty", info), { exact: true })
        ).toBeVisible();
      if (route === "/notifications")
        await expect(
          page.getByText(message("notifications.empty", info), { exact: true })
        ).toBeVisible();
    },
  })),
  {
    route: "/datasets",
    path: "/datasets?page=1",
    ready: async (page) => {
      await expect(
        page.getByRole("link", { name: /cancer cohort study/i })
      ).toBeVisible();
    },
  },
  {
    route: "/datasets/[id]",
    path: "/datasets/ds-001",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", { name: /cancer cohort study/i })
      ).toBeVisible();
    },
  },
  {
    route: "/requests",
    path: "/requests?tab=applications",
    auth: true,
    ready: async (page) => {
      await expect(
        page.getByRole("link", { name: /synthetic research application/i })
      ).toBeVisible();
    },
  },
  {
    route: "/applications/[id]",
    path: "/applications/89",
    auth: true,
    ready: async (page) => {
      await expect(
        page.getByRole("textbox", { name: "Research purpose", exact: true })
      ).toHaveValue("Synthetic cohort research");
    },
  },
  {
    route: "/harvester-logs",
    path: "/harvester-logs?page=1",
    auth: true,
    ready: async (page) => {
      await expect(
        page.getByRole("button", { name: /synthetic-catalogue/i })
      ).toBeVisible();
    },
  },
  // Keep these feature-gated routes in the inventory without scanning a 404.
  { route: "/models", scan: false, ready: async () => {} },
  { route: "/models/[id]", scan: false, ready: async () => {} },
];
const discoverPages = (directory: string, route = ""): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      if (["api", "__tests__"].includes(entry.name)) return [];
      return discoverPages(
        join(directory, entry.name),
        entry.name === "[locale]" ? route : `${route}/${entry.name}`
      );
    }
    return /^page\.[jt]sx?$/.test(entry.name) ? [route || "/"] : [];
  });
test("every executable route has an accessibility scan", () => {
  const nonExecutableRoutes = new Set(
    pages.filter(({ scan }) => scan === false).map(({ route }) => route)
  );
  const executablePages = pages.filter(({ scan }) => scan !== false);

  expect(
    [...new Set(discoverPages(join(process.cwd(), "src/app")))]
      .filter((route) => !nonExecutableRoutes.has(route))
      .sort()
  ).toEqual(executablePages.map(({ route }) => route).sort());
});
test("skip link bypasses repeated content", async ({ page }, info) => {
  await page.goto(url("/", info));

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", {
    name: message("accessibility.skipToMainContent", info),
    exact: true,
  });
  await expect(skipLink).toBeVisible();
  await expect(skipLink).toBeFocused();

  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator("main#main-content")).toBeFocused();
});
for (const entry of pages.filter(({ scan }) => scan !== false)) {
  test(`${entry.route} page`, async ({ page }, info) => {
    if (entry.auth) await authenticate(page);
    const response = await page.goto(url(entry.path || entry.route, info));
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("html")).toHaveAttribute("lang", language(info));
    await entry.ready(page, info);
    await expectNoAccessibilityViolations(page, info);
    if (info.project.name.includes("mobile")) {
      await info.attach("narrow-layout", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        "Page must reflow at 320 CSS pixels; wide tables should scroll inside their own container"
      ).toBeLessThanOrEqual(321);
    }
  });
}
