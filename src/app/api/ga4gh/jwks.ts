// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import "server-only";
import {
  createRemoteJWKSet,
  FlattenedJWSInput,
  JWTHeaderParameters,
  KeyLike,
} from "jose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A key-resolution function compatible with jose's `jwtVerify`. */
export type JwksFetcher = (
  protectedHeader: JWTHeaderParameters,
  token: FlattenedJWSInput
) => Promise<KeyLike | Uint8Array>;

/**
 * Resolves the JWKS key-fetcher for a given `jku` URL.
 * Throws when the `jku` is invalid or not HTTPS.
 */
export type JwksResolver = (jku: string) => Promise<JwksFetcher>;

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

/**
 * Module-level cache: jku URL → RemoteJWKSet function.
 *
 * Bounded to prevent unbounded memory growth from a large or attacker-controlled
 * set of jku values. Oldest entry is evicted (FIFO) when the limit is reached.
 * Entries expire after {@link JWKS_CACHE_TTL_MS} so that key rotation and
 * revocation are picked up within a bounded window.
 */
const MAX_JWKS_CACHE_SIZE = 100;
/** 1 hour — balances performance with timely key-rotation pickup. */
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000;

type CacheEntry = { fetcher: JwksFetcher; expiresAt: number };
const jwksCache = new Map<string, CacheEntry>();

function setCachedJwksFetcher(jku: string, fetcher: JwksFetcher): void {
  if (!jwksCache.has(jku) && jwksCache.size >= MAX_JWKS_CACHE_SIZE) {
    const oldestKey = jwksCache.keys().next().value as string | undefined;
    if (oldestKey !== undefined) {
      jwksCache.delete(oldestKey);
    }
  }
  jwksCache.set(jku, { fetcher, expiresAt: Date.now() + JWKS_CACHE_TTL_MS });
}

/**
 * Validates a `jku` (JWK Set URL) from a JWT header.
 *
 * Rules:
 * - `jku` must be a valid URL.
 * - `jku` must use the `https:` scheme (prevents plain-HTTP MITM attacks).
 *
 * @throws If any of the above rules are violated.
 */
export function validateJku(jku: string): void {
  let parsed: URL;
  try {
    parsed = new URL(jku);
  } catch {
    throw new Error(`Invalid jku URL in visa JWT header: "${jku}"`);
  }

  // In non-production environments (ALLOW_LOCALHOST_JKU=true), allow HTTP for
  // local hosts so the mock API server can serve JWKS without TLS.
  // NODE_ENV !== "production" ensures this never fires in a deployed instance.
  const allowedLocalHostnames = new Set([
    "localhost",
    "127.0.0.1",
    "::1",
    "localhost.localdomain",
  ]);

  const isLocalhostHttp =
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_LOCALHOST_JKU === "true" &&
    parsed.protocol === "http:" &&
    allowedLocalHostnames.has(parsed.hostname);

  if (parsed.protocol !== "https:" && !isLocalhostHttp) {
    throw new Error(`jku must use HTTPS scheme, got "${jku}"`);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns a JWKS key-fetcher for the given `jku` URL.
 *
 * Requires `jku` to pass {@link validateJku} (must be a valid HTTPS URL).
 * Trust is established through signature verification — only JWTs whose
 * signatures verify against the keys at `jku` will be accepted.
 *
 * Results are cached per `jku` URL for up to 1 hour (see {@link JWKS_CACHE_TTL_MS}).
 * Call {@link clearJwksCache} to invalidate the cache (e.g. in tests).
 */
export async function resolveJwksForJku(jku: string): Promise<JwksFetcher> {
  validateJku(jku); // throws for invalid / non-HTTPS jku

  const entry = jwksCache.get(jku);
  if (entry && Date.now() < entry.expiresAt) return entry.fetcher;

  const getKey = createRemoteJWKSet(new URL(jku));
  setCachedJwksFetcher(jku, getKey);
  return getKey;
}

/**
 * Clears the module-level JWKS cache.
 *
 * Intended for use in unit tests to prevent caching side-effects between
 * test cases that modify `process.env.TRUSTED_VISA_ISSUERS`.
 */
export function clearJwksCache(): void {
  jwksCache.clear();
}
