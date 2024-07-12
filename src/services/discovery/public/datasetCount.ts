// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SDPX-Contributor: Stichting Health-RI
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import { DatasetsSearchResponse } from "../types/datasetSearch.types";
import { DEFAULT_DATASET_SEARCH_QUERY, createHeaders } from "../utils";

export const makeDatasetCount = (discoveryUrl: string) => {
  return async (): Promise<number> => {
    const response = await axios.post<DatasetsSearchResponse>(
      `${discoveryUrl}/api/v1/datasets/search`,
      DEFAULT_DATASET_SEARCH_QUERY,
      {
        headers: await createHeaders(),
      }
    );

    return response.data.count;
  };
};
