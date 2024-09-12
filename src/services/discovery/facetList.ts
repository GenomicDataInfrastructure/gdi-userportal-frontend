// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import axios, { AxiosResponse } from "axios";
import { createHeaders } from "./utils";
import { Facet } from "./types/facets.type";

export const makeFacetList = (discoveryUrl: string) => {
  return async (session?: ExtendedSession): Promise<AxiosResponse<Facet[]>> => {
    return await axios.get<Facet[]>(`${discoveryUrl}/api/v1/search-facets`, {
      headers: await createHeaders(session),
    });
  };
};
