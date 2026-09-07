// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  harvestLocalIndexFromDcatFileApi,
  harvestLocalIndexFromDcatUrlApi,
} from "@/app/api/discovery/local-index";
import type { HarvestLocalIndexMode } from "@/app/api/discovery/local-index";
import {
  getProvidedSecret,
  secretsMatch,
} from "@/app/api/discovery/harvest/harvest-secret";

const HARVEST_MODES = new Set<HarvestLocalIndexMode>(["replace", "append"]);

export async function POST(request: Request) {
  const configuredSecret = process.env.HARVEST_INTERNAL_SECRET?.trim();
  if (!configuredSecret) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const providedSecret = getProvidedSecret(request);
  if (!secretsMatch(configuredSecret, providedSecret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      url?: string;
      path?: string;
      mode?: HarvestLocalIndexMode;
      contentType?: string;
    };
    const url = body?.url?.trim();
    const path = body?.path?.trim();
    const mode = body?.mode ?? "replace";
    const contentType = body?.contentType?.trim();

    if (!url && !path) {
      return Response.json(
        { error: 'Missing required field "url" or "path"' },
        { status: 400 }
      );
    }

    if (!HARVEST_MODES.has(mode)) {
      return Response.json(
        { error: 'Invalid field "mode". Expected "replace" or "append".' },
        { status: 400 }
      );
    }

    const count = path
      ? await harvestLocalIndexFromDcatFileApi(path, {
          mode,
          ...(contentType ? { contentType } : {}),
        })
      : await harvestLocalIndexFromDcatUrlApi(url as string, {
          mode,
          ...(contentType ? { contentType } : {}),
        });
    return Response.json({ count });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
