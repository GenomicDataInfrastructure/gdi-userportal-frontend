// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { ExtendedSession } from "@/app/api/auth/auth.types";
import { decrypt } from "@/utils/encryption";
import { DatasetSearchQuery } from "./types/datasetSearch.types";

export const createHeaders = async (
  session: ExtendedSession | null
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!!session) {
    headers["Authorization"] = `Bearer ${decrypt(session.access_token)}`;
  }

  return headers;
};

export const DEFAULT_DATASET_SEARCH_QUERY: DatasetSearchQuery = {
  rows: 0,
};
