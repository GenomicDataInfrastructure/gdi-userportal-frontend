"use server";

import { ExtendedSession } from "@/app/api/auth/types/auth.types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { decrypt } from "@/utils/encryption";

export const createHeaders = async (): Promise<Record<string, string>> => {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!!session) {
    headers["Authorization"] = `Bearer ${decrypt(session.access_token)}`;
  }
  return headers;
};
