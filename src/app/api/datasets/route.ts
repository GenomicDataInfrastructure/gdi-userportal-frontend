// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { datasetList } from "@/services/discovery";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ExtendedSession } from "../auth/auth.types";
import { authOptions } from "../auth/config";
import { handleErrorResponse } from "../errorHandling";

export async function POST(request: Request) {
  const session: ExtendedSession | null = await getServerSession(authOptions);

  try {
    const { options } = await request.json();
    const response = await datasetList(options, session!);

    const result = {
      datasets: response.data.results,
      count: response.data.count,
    };

    return NextResponse.json(result);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
