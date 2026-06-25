// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { defineRouting } from "next-intl/routing";

const multilingualEnabled =
  process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL?.toLowerCase() === "true";

export const routing = defineRouting({
  locales: multilingualEnabled ? ["en", "fr"] : ["en"],
  defaultLocale: "en",
  localePrefix: multilingualEnabled ? "always" : "never",
});

export type AppLocale = (typeof routing.locales)[number];
export const isMultilingualEnabled = multilingualEnabled;
