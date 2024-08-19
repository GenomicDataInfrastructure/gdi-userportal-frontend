// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import { NextResponse } from "next/server";

export function handleErrorResponse(error: unknown) {
  console.log(error);
  if (axios.isAxiosError(error)) {
    return NextResponse.json(error.response?.data, {
      status: error.response?.status,
    });
  } else if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { error: "Unexpected error occurred" },
    { status: 500 }
  );
}
