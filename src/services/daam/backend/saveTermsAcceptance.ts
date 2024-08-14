// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import { AcceptTermsCommand } from "@/types/application.types";
import { decrypt } from "@/utils/encryption";
import axios, { AxiosResponse } from "axios";

export function makeSaveTermsAcceptance(daamUrl: string) {
  return async (
    applicationId: string,
    acceptedLicenses: AcceptTermsCommand[],
    session: ExtendedSession
  ): Promise<AxiosResponse<void>> => {
    const requestBody = { acceptedLicenses };

    return await axios.post(
      `${daamUrl}/api/v1/applications/${applicationId}/accept-terms`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decrypt(session.access_token)}`,
        },
      }
    );
  };
}
