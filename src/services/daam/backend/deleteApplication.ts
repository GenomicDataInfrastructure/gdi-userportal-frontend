// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import { decrypt } from "@/utils/encryption";
import axios, { AxiosResponse } from "axios";

export const makeDeleteApplication = (daamUrl: string) => {
  return async (
    applicationId: string,
    session: ExtendedSession
  ): Promise<AxiosResponse<void>> => {
    return await axios.delete(
      `${daamUrl}/api/v1/applications/${applicationId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decrypt(session.access_token)}`,
        },
      }
    );
  };
};
