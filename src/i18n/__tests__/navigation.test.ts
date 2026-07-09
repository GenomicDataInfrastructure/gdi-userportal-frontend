// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

const createNavigationMock = jest.fn((_routing?: unknown) => ({
  Link: "Link",
  redirect: jest.fn(),
  permanentRedirect: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  getPathname: jest.fn(),
}));

jest.mock("next-intl/navigation", () => ({
  createNavigation: (routing: unknown) => createNavigationMock(routing),
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

describe("i18n navigation", () => {
  it("creates navigation helpers from the routing config", async () => {
    const { routing } = await import("@/i18n/routing");
    const navigation = await import("@/i18n/navigation");

    expect(createNavigationMock).toHaveBeenCalledWith(routing);
    expect(navigation.Link).toBe("Link");
    expect(typeof navigation.redirect).toBe("function");
  });
});
