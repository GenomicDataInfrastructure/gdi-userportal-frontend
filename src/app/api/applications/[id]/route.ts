// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  retrieveApplication,
  deleteApplication,
} from "@/services/daam/index.server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ExtendedSession } from "../../auth/auth.types";
import { authOptions } from "../../auth/config";
import { handleErrorResponse } from "../../errorHandling";

export async function GET(
  request: Request,
  params: { params: { id: string } }
) {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const { id } = params.params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: application } = await retrieveApplication(id, session);
    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  params: { params: { id: string } }
) {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const { id } = params.params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteApplication(id, session);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
