// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const publicPaths = ["/", "/datasets", "/themes", "/publishers", "/about"];

  return routing.locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path === "/" ? "" : path}`,
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alternateLocale) => [
            alternateLocale,
            `${baseUrl}/${alternateLocale}${path === "/" ? "" : path}`,
          ])
        ),
      },
    }))
  );
}
