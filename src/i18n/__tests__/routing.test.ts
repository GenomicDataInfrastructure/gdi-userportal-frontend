// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

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
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL;
    jest.resetModules();
  });

  it("defaults to english-only routing when multilingual is disabled", async () => {
    const { routing } = await import("@/i18n/routing");

    expect(routing.locales).toEqual(["en"]);
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toEqual({ mode: "never" });
  });

  it("enables locale-prefixed routing when multilingual is turned on", async () => {
    process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL = "true";

    const { routing } = await import("@/i18n/routing");

    expect(routing.locales).toEqual(["en", "fr"]);
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toEqual({ mode: "always" });
  });
});
