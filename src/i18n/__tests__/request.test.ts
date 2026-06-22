// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

jest.mock("next-intl/server", () => ({
  getRequestConfig: (
    factory: (params: {
      requestLocale: Promise<string | undefined>;
    }) => Promise<unknown>
  ) => factory,
}));

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

describe("i18n request config", () => {
  it("returns locale specific messages for a supported locale", async () => {
    const requestConfig = (await import("@/i18n/request")).default;

    const result = (await requestConfig({
      requestLocale: Promise.resolve("fr"),
    })) as {
      locale: string;
      messages: { auth: { login: string } };
    };

    expect(result.locale).toBe("fr");
    expect(result.messages.auth.login).toBe("Connexion");
  });

  it("falls back to the default locale for unsupported locales", async () => {
    const requestConfig = (await import("@/i18n/request")).default;

    const result = (await requestConfig({
      requestLocale: Promise.resolve("de"),
    })) as {
      locale: string;
      messages: { nav: { home: string } };
    };

    expect(result.locale).toBe("en");
    expect(result.messages.nav.home).toBe("Home");
  });
});
