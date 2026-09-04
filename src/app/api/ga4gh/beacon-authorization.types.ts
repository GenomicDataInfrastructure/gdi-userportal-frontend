// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export type BeaconAuthorizationStatus = {
  hasResearcherStatus: boolean;
  hasAcceptedTC: boolean;
};

export const BEACON_AUTHORIZATION_ERROR = "INSUFFICIENT_PERMISSIONS";

export class BeaconAuthorizationError extends Error {
  readonly statusCode = 403;

  constructor(
    message: string,
    public readonly details: BeaconAuthorizationStatus
  ) {
    super(message);
    this.name = BEACON_AUTHORIZATION_ERROR;
  }

  toJSON() {
    return {
      error: BEACON_AUTHORIZATION_ERROR,
      message: this.message,
      details: this.details,
    };
  }
}
