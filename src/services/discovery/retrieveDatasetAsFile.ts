// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import axios, { AxiosResponse } from "axios";
import { createHeaders } from "./utils";

export const makeRetrieveDatasetAsFile = (discoveryUrl: string) => {
  return async (
    id: string,
    format: string,
    session: ExtendedSession | null
  ): Promise<AxiosResponse> => {
    return await axios.get(`${discoveryUrl}/api/v1/datasets/${id}.${format}`, {
      headers: await createHeaders(session),
      responseType: "text",
    });
  };
};
