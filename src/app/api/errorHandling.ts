// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import { NextResponse } from "next/server";
import { ErrorResponse } from "@/types/api.types";

export function handleErrorResponse(
  error: unknown
): NextResponse<ErrorResponse> {
  console.log(error);

  if (axios.isAxiosError(error)) {
    return NextResponse.json(error.response?.data, {
      status: error.response?.status,
    });
  }

  return NextResponse.json(
    {
      status: 500,
      title: "Unexpected error occurred",
      detail: "Unexpected error occurred, please contact the administrators.",
      validationWarnings: [],
    },
    { status: 500 }
  );
}
