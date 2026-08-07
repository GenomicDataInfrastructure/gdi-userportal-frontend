// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { timingSafeEqual } from "node:crypto";
import {
  harvestLocalIndexFromDcatFileApi,
  harvestLocalIndexFromDcatUrlApi,
} from "@/app/api/discovery/local-index";
import type { HarvestLocalIndexMode } from "@/app/api/discovery/local-index";

const HARVEST_MODES = new Set<HarvestLocalIndexMode>(["replace", "append"]);

const getProvidedSecret = (request: Request): string => {
  const headerSecret = request.headers.get("x-harvest-secret")?.trim();
  if (headerSecret) {
    return headerSecret;
  }

  const authorization = request.headers.get("authorization")?.trim();
  if (!authorization) {
    return "";
  }

  const bearerPrefix = "Bearer ";
  return authorization.startsWith(bearerPrefix)
    ? authorization.slice(bearerPrefix.length).trim()
    : "";
};

const secretsMatch = (
  configuredSecret: string,
  providedSecret: string
): boolean => {
  if (!configuredSecret || !providedSecret) {
    return false;
  }

  const configuredBuffer = Buffer.from(configuredSecret);
  const providedBuffer = Buffer.from(providedSecret);

  if (configuredBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(configuredBuffer, providedBuffer);
};

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
    };
    const url = body?.url?.trim();
    const path = body?.path?.trim();
    const mode = body?.mode ?? "replace";

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
      ? await harvestLocalIndexFromDcatFileApi(path, { mode })
      : await harvestLocalIndexFromDcatUrlApi(url as string, { mode });
    return Response.json({ count });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
