// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { timingSafeEqual } from "node:crypto";
import { harvestLocalIndexFromDcatUrlApi } from "@/app/api/discovery/local-index";

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
