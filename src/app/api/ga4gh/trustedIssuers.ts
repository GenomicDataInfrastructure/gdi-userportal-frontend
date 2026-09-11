// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import "server-only";

const LOCAL_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "localhost.localdomain",
]);

/**
 * Normalizes a GA4GH Visa issuer URL for allow-list comparison.
 *
 * Issuers must be absolute HTTPS URLs. HTTP is accepted only for local hosts
 * outside production when ALLOW_LOCALHOST_JKU is explicitly enabled, matching
 * the development exception used by the JWKS resolver.
 */
export function normalizeVisaIssuer(issuer: unknown): string | null {
  if (typeof issuer !== "string" || issuer.trim() === "") return null;

  let parsed: URL;
  try {
    parsed = new URL(issuer.trim());
  } catch {
    return null;
  }

  const isAllowedLocalhostHttp =
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_LOCALHOST_JKU === "true" &&
    parsed.protocol === "http:" &&
    LOCAL_HOSTNAMES.has(parsed.hostname);

  if (parsed.protocol !== "https:" && !isAllowedLocalhostHttp) return null;
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    return null;
  }

  const pathname = parsed.pathname.replace(/\/+$/, "");
  return `${parsed.origin}${pathname}`;
}

/** Returns the normalized, valid issuers configured for GA4GH Visas. */
export function getTrustedVisaIssuers(): Set<string> {
  const configured = process.env.TRUSTED_VISA_ISSUERS;
  if (!configured) return new Set();

  const trusted = new Set<string>();
  for (const entry of configured.split(",")) {
    const normalized = normalizeVisaIssuer(entry);
    if (normalized !== null) trusted.add(normalized);
  }
  return trusted;
}

/** Returns whether an untrusted runtime value is a configured Visa issuer. */
export function isTrustedVisaIssuer(
  issuer: unknown,
  trusted: ReadonlySet<string>
): boolean {
  const normalized = normalizeVisaIssuer(issuer);
  return normalized !== null && trusted.has(normalized);
}
