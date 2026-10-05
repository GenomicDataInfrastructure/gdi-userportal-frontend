// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
import AxeBuilder from "@axe-core/playwright";
import {
  test as base,
  expect,
  type Page,
  type TestInfo,
} from "@playwright/test";
import { encode } from "next-auth/jwt";
import messages from "../../src/i18n/messages.json";

export const test = base.extend<{ resetMock: void }>({
  resetMock: [
    async ({ request }, runFixture) => {
      const origin = `http://localhost:${process.env.MOCK_API_PORT || 4010}`;
      expect(
        (
          await request.post(`${origin}/_test/accessibility`, {
            data: { scenario: "baseline" },
          })
        ).ok()
      ).toBeTruthy();
      expect(
        (
          await request.post(`${origin}/_test/set-scenario`, {
            data: { scenario: "default" },
          })
        ).ok()
      ).toBeTruthy();
      try {
        await runFixture();
      } finally {
        await request.post(`${origin}/_test/accessibility-release`);
      }
    },
    { auto: true },
  ],
});
export { expect };
export const language = (info: TestInfo): "en" | "fr" =>
  info.project.metadata.language === "fr" ? "fr" : "en";
export const url = (path: string, info: TestInfo) =>
  `/${language(info)}${path === "/" ? "" : path}`;
export const message = (key: keyof typeof messages, info: TestInfo) =>
  String(messages[key][language(info)]);
export const scenario = async (page: Page, value: string) => {
  expect(
    (
      await page.request.post(
        `http://localhost:${process.env.MOCK_API_PORT || 4010}/_test/accessibility`,
        { data: { scenario: value } }
      )
    ).ok()
  ).toBeTruthy();
};
export const visaScenario = async (page: Page, value: string) => {
  expect(
    (
      await page.request.post(
        `http://localhost:${process.env.MOCK_API_PORT || 4010}/_test/set-scenario`,
        { data: { scenario: value } }
      )
    ).ok()
  ).toBeTruthy();
};
const wcagTags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22a",
  "wcag22aa",
];

export const expectNoAccessibilityViolations = async (
  page: Page,
  testInfo: TestInfo
) => {
  // Scan the settled visual state, including hover/focus transitions. Infinite
  // loading indicators must not prevent a loading-state scan from completing.
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity
        )
        .map((animation) => animation.finished.catch(() => {}))
    );
  });
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  const violationSummary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    targets: violation.nodes.flatMap((node) => node.target),
  }));

  await testInfo.attach("axe-accessibility-results", {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });

  expect(
    results.violations,
    JSON.stringify(violationSummary, null, 2)
  ).toHaveLength(0);
};

export const authenticate = async (page: Page) => {
  const token = await encode({
    token: {
      sub: "accessibility-test-user",
      name: "Accessibility Test User",
      email: "accessibility@example.com",
      access_token: "accessibility-test-access-token",
      id_token: "accessibility-test-id-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret",
    maxAge: 3600,
  });

  await page.context().addCookies([
    {
      name: "next-auth.session-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
};
