// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type { AxiosInstance } from "axios";

// Server-side requests never ask for Brotli responses (CVE-2026-111497).
export const ACCEPT_ENCODING = "gzip, deflate";

const toHeaderRecord = (headers?: HeadersInit): Record<string, string> => {
  if (!headers) return {};
  if (typeof Headers !== "undefined" && headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return { ...(headers as Record<string, string>) };
};

/**
 * Returns the caller's headers with `accept-encoding: gzip, deflate`,
 * replacing any accept-encoding header the caller set.
 */
export const withAcceptEncoding = (
  headers?: HeadersInit
): Record<string, string> => {
  const merged = Object.fromEntries(
    Object.entries(toHeaderRecord(headers)).filter(
      ([name]) => name.toLowerCase() !== "accept-encoding"
    )
  );
  return { ...merged, "accept-encoding": ACCEPT_ENCODING };
};

/**
 * Sets `Accept-Encoding: gzip, deflate` on every request of an axios instance,
 * replacing instance defaults and per-request values.
 */
export const enforceAcceptEncoding = <T extends AxiosInstance>(
  instance: T
): T => {
  instance.interceptors.request.use((config) => {
    config.headers.set("Accept-Encoding", ACCEPT_ENCODING);
    return config;
  });
  return instance;
};
