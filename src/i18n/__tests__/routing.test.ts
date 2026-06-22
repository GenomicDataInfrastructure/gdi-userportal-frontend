// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { routing } from "@/i18n/routing";

jest.mock("next-intl/routing", () => ({
  defineRouting: (config: {
    locales: string[];
    defaultLocale: string;
    localePrefix: string;
  }) => ({
    ...config,
    localePrefix: { mode: config.localePrefix },
  }),
}));

describe("i18n routing", () => {
  it("defines the supported locales and default locale", () => {
    expect(routing.locales).toEqual(["en", "fr"]);
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix.mode).toBe("always");
  });
});
