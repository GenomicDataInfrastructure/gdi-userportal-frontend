// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ExtendedSession } from "../../../../auth/auth.types";
import { authOptions } from "../../../../auth/config";
import { handleErrorResponse } from "../../../../errorHandling";
import { retrieveDatasetAsFile } from "@/services/discovery";

export async function GET(
  request: Request,
  params: { params: { id: string; format: string } }
) {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const { id, format } = params.params;

  try {
    const response = await retrieveDatasetAsFile(id, format, session);

    const headers = new Headers({
      "Content-Type": response.headers["content-type"],
      "Content-Disposition": response.headers["content-disposition"],
    });

    return new NextResponse(response.data, { headers, status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
