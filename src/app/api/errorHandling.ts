// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import { NextResponse } from "next/server";
import { ErrorResponse } from "@/types/api.types";

export function handleErrorResponse(
  error: unknown
): NextResponse<ErrorResponse> {
  if (axios.isAxiosError(error)) {
    let content = error.response?.data;

    if (typeof content === "object" && content !== null) {
      content = JSON.stringify(content);
    }

    return new NextResponse(content, {
      status: error.response?.status,
      headers: {
        "Content-Type": "application/json",
      },
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
