// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import { RetrieveGrantedDatasetIdentifiers } from "@/types/entitlements.types";
import { decrypt } from "@/utils/encryption";
import axios, { AxiosResponse } from "axios";

export function makeRetrieveEntitlements(daamUrl: string) {
  return async (
    session: ExtendedSession
  ): Promise<AxiosResponse<RetrieveGrantedDatasetIdentifiers>> => {
    return await axios.get(`${daamUrl}/api/v1/entitlements`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decrypt(session.access_token)}`,
      },
    });
  };
}
