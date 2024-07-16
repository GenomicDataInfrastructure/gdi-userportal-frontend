// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ExtendedSession } from "../auth/auth.types";
import { authOptions } from "../auth/config";
import { retrieveEntitlements } from "@/services/daam/index.server";

export async function GET() {
  const session: ExtendedSession | null = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await retrieveEntitlements(session);

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data },
        { status: error.response?.status }
      );
    } else if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to retrive entitlements" },
      { status: 500 }
    );
  }
}
