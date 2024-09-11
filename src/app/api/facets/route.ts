// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { facetList } from "@/services/discovery";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ExtendedSession } from "../auth/auth.types";
import { authOptions } from "../auth/config";
import { handleErrorResponse } from "../errorHandling";

export async function GET() {
  const session: ExtendedSession | null = await getServerSession(authOptions);

  try {
    const response = await facetList(session!);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
