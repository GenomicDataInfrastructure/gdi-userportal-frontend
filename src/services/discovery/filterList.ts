// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import axios, { AxiosResponse } from "axios";
import { createHeaders } from "./utils";
import { Filter } from "./types/filter.type";

export const makeFilterList = (discoveryUrl: string) => {
  return async (
    session: ExtendedSession | null
  ): Promise<AxiosResponse<Filter[]>> => {
    return await axios.get<Filter[]>(`${discoveryUrl}/api/v1/filters`, {
      headers: await createHeaders(session),
    });
  };
};
