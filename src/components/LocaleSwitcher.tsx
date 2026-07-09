// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();

  function buildLocalePath(nextLocale: string) {
    const { pathname, search, hash } = window.location;
    const localePrefixPattern = new RegExp(
      `^/(?:${routing.locales.join("|")})(?=/|$)`
    );
    const pathWithoutLocale = pathname.replace(localePrefixPattern, "") || "/";
    const localizedPath =
      pathWithoutLocale === "/"
        ? `/${nextLocale}`
        : `/${nextLocale}${pathWithoutLocale}`;

    return `${localizedPath}${search}${hash}`;
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-semibold">{t("label")}</span>
      <select
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-primary"
        value={locale}
        onChange={(event) => {
          window.location.assign(buildLocalePath(event.target.value));
        }}
        aria-label={t("label")}
      >
        {routing.locales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {t(supportedLocale)}
          </option>
        ))}
      </select>
    </label>
  );
}
