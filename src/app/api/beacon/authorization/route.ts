// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from "next/server";
import { checkBeaconAuthorization } from "@/app/api/ga4gh/beacon-authorization";
import { BeaconAuthorizationStatus } from "@/app/api/ga4gh/beacon-authorization.types";

export async function GET(): Promise<NextResponse<BeaconAuthorizationStatus>> {
  try {
    const status = await checkBeaconAuthorization();
    if (!status.hasResearcherStatus || !status.hasAcceptedTC) {
      return NextResponse.json(status, { status: 403 });
    }
    return NextResponse.json(status);
  } catch (error) {
    console.error("[beacon/authorization] unexpected error", error);
    return NextResponse.json(
      { hasResearcherStatus: false, hasAcceptedTC: false },
      { status: 500 }
    );
  }
}
