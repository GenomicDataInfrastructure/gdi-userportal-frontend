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
 */
const MAX_JWKS_CACHE_SIZE = 100;
const jwksCache = new Map<string, JwksFetcher>();

function setCachedJwksFetcher(jku: string, fetcher: JwksFetcher): void {
  if (!jwksCache.has(jku) && jwksCache.size >= MAX_JWKS_CACHE_SIZE) {
    const oldestKey = jwksCache.keys().next().value as string | undefined;
    if (oldestKey !== undefined) {
      jwksCache.delete(oldestKey);
    }
  }
  jwksCache.set(jku, fetcher);
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

  if (parsed.protocol !== "https:") {
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
 * Results are cached per `jku` URL for the lifetime of the Node.js process.
 * Call {@link clearJwksCache} to invalidate the cache (e.g. in tests).
 */
export async function resolveJwksForJku(jku: string): Promise<JwksFetcher> {
  validateJku(jku); // throws for invalid / non-HTTPS jku

  const cached = jwksCache.get(jku);
  if (cached) return cached;

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
