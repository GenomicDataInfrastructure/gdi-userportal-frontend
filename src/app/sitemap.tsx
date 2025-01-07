// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return [
    {
      url: baseUrl,
      priority: 1,
    },
    {
      url: `${baseUrl}/datasets`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/themes`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/publishers`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      priority: 0.8,
    },
  ];
}
