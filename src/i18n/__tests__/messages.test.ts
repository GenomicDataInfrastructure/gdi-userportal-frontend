// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getFlatMessages, getMessages } from "@/i18n/messages";

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

describe("i18n messages", () => {
  it("returns flat messages for a locale", () => {
    const messages = getFlatMessages("fr");

    expect(messages["auth.login"]).toBe("Connexion");
    expect(messages["basket.addToBasket"]).toBe("Ajouter au panier");
  });

  it("returns nested messages for next-intl consumption", () => {
    const messages = getMessages("en") as {
      auth: { logout: string };
      basket: { removeFromBasket: string };
    };

    expect(messages.auth.logout).toBe("Log out");
    expect(messages.basket.removeFromBasket).toBe("Remove from basket");
  });
});
