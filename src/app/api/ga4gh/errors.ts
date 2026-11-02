// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Thrown when LS-AAI rejects the Keycloak access token itself (HTTP 401),
 * as opposed to LS-AAI being unreachable or returning no passport claim.
 */
export class LsAaiUnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LsAaiUnauthorizedError";
  }
}
