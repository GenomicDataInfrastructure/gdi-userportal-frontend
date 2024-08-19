// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import { decrypt } from "@/utils/encryption";
import axios, { AxiosResponse } from "axios";

export function makeSubmitApplication(daamUrl: string) {
  return async (
    applicationId: string,
    session: ExtendedSession
  ): Promise<AxiosResponse<void>> => {
    return await axios.post(
      `${daamUrl}/api/v1/applications/${applicationId}/submit`,
      {
        headers: {
          Authorization: `Bearer ${decrypt(session.access_token)}`,
        },
      }
    );
  };
}
