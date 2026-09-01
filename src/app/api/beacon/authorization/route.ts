// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from "next/server";
import { checkBeaconAuthorization } from "@/app/api/ga4gh/beacon-authorization";
import {
  BeaconAuthorizationStatus,
  BeaconAuthorizationError,
} from "@/app/api/ga4gh/beacon-authorization.types";

export async function GET(): Promise<NextResponse<BeaconAuthorizationStatus>> {
  try {
    const status = await checkBeaconAuthorization();
    return NextResponse.json(status);
  } catch (error) {
    if (error instanceof BeaconAuthorizationError) {
      return NextResponse.json(error.details, { status: 403 });
    }

    console.error("[beacon/authorization] unexpected error", error);
    return NextResponse.json(
      { hasResearcherStatus: false, hasAcceptedTC: false },
      { status: 500 }
    );
  }
}
