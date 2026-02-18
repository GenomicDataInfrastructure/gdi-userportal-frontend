// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { authOptions } from "@/app/api/auth/config";
import { ExtendedSession } from "@/app/api/auth/types/auth.types";
import { decrypt } from "@/utils/encryption";
import { getServerSession } from "next-auth";

export const createHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Skip auth header in development when SKIP_AUTH is set
  if (process.env.SKIP_AUTH === "true") {
    return headers;
  }

  const session: ExtendedSession | null = await getServerSession(authOptions);

  if (session) {
    headers["Authorization"] = `Bearer ${decrypt(session.access_token)}`;
  }
  return headers;
};

export const createAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    // "Content-Type": "application/json",
  };
  const session: ExtendedSession | null = await getServerSession(authOptions);

  if (session) {
    headers["Authorization"] = `Bearer ${decrypt(session.access_token)}`;
  }
  return headers;
};
