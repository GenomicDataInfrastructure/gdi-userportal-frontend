// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { harvestLocalIndexFromDcatUrlApi } from "@/app/api/discovery/local-index";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { url?: string };
    const url = body?.url?.trim();

    if (!url) {
      return Response.json(
        { error: 'Missing required field "url"' },
        { status: 400 }
      );
    }

    const count = await harvestLocalIndexFromDcatUrlApi(url);
    return Response.json({ count });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
