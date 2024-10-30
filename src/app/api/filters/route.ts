// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ExtendedSession } from "../auth/auth.types";
import { authOptions } from "../auth/config";
import { handleErrorResponse } from "../errorHandling";
import { filterList } from "@/services/discovery";

export async function GET() {
  const session: ExtendedSession | null = await getServerSession(authOptions);

  try {
    const response = await filterList(session!);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
