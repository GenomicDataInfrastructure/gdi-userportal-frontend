// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import axios, { AxiosResponse } from "axios";
import {
  DatasetSearchOptions,
  DatasetsSearchResponse,
} from "./types/datasetSearch.types";
import { createHeaders } from "./utils";

export const makeDatasetList = (discoveryUrl: string) => {
  return async (
    options: DatasetSearchOptions,
    session: ExtendedSession | null
  ): Promise<AxiosResponse<DatasetsSearchResponse>> => {
    return await axios.post<DatasetsSearchResponse>(
      `${discoveryUrl}/api/v1/datasets/search`,
      options,
      {
        headers: await createHeaders(session),
      }
    );
  };
};
