// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { timingSafeEqual } from "node:crypto";

/**
 * Reads the harvest shared secret from a request, accepting either the
 * `x-harvest-secret` header or an `Authorization: Bearer <secret>` header.
 */
export const getProvidedSecret = (request: Request): string => {
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

/** Constant-time comparison of the configured and provided harvest secrets. */
export const secretsMatch = (
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
