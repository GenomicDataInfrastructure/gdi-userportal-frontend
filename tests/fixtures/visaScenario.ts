// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { randomUUID } from "node:crypto";
import { expect, type Page } from "@playwright/test";

// The token follows the real broker/userinfo Authorization flow, including
// server-side requests that cannot be intercepted by page.route().
const sessionTokens = new WeakMap<Page, string>();

export function mockAccessToken(page: Page): string {
  let token = sessionTokens.get(page);
  if (!token) {
    token = `e2e-session-${randomUUID()}`;
    sessionTokens.set(page, token);
  }
  return token;
}

export async function setVisaScenario(page: Page, scenario: string) {
  const response = await page.request.post(
    `http://localhost:${process.env.MOCK_API_PORT || 4010}/_test/set-scenario`,
    { data: { scenario, accessToken: mockAccessToken(page) } }
  );
  expect(response.ok(), "Mock visa scenario must be configured").toBeTruthy();
}
