// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

// Server Actions only forward `Error.message` to the calling client code —
// custom properties/classes (e.g. AxiosError.response, LsAaiUnauthorizedError)
// are stripped — so a stable message string is how the client reliably
// detects an unauthorized/stale-token response and re-authenticates.
export const ACCESS_MANAGEMENT_UNAUTHORIZED_MESSAGE =
  "ACCESS_MANAGEMENT_UNAUTHORIZED";

export function isAccessManagementUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message === ACCESS_MANAGEMENT_UNAUTHORIZED_MESSAGE
  );
}
