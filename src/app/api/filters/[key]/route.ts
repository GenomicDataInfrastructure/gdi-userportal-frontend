// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from "next/server";
import { handleErrorResponse } from "@/app/api/errorHandling";
import { filterValuesList } from "@/services/discovery";
import { FilterValueType } from "@/services/discovery/types/dataset.types";

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const response = await filterValuesList(params.key as FilterValueType);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
