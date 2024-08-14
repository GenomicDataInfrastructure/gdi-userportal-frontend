// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import { authOptions } from "@/app/api/auth/config";
import serverConfig from "@/config/serverConfig";
import { makeSaveTermsAcceptance } from "@/services/daam/backend/saveTermsAcceptance";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { handleErrorResponse } from "@/app/api/errorHandling";

export async function POST(
  request: Request,
  params: { params: { id: string } }
): Promise<Response> {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const { id } = params.params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { acceptedLicenses } = await request.json();

    if (!Array.isArray(acceptedLicenses) || acceptedLicenses.some(isNaN)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const saveTermsAcceptance = await makeSaveTermsAcceptance(
      serverConfig.daamUrl
    );

    await saveTermsAcceptance(id, acceptedLicenses, session);

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
