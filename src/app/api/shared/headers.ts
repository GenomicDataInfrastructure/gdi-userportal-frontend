// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { authOptions } from "@/app/api/auth/config";
import { ExtendedSession } from "@/app/api/auth/types/auth.types";
import { decrypt } from "@/utils/encryption";
import { getServerSession } from "next-auth";

export const createHeaders = async (): Promise<Record<string, string>> => {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session) {
    headers["Authorization"] = `Bearer ${decrypt(session.access_token)}`;
  }
  return headers;
};
