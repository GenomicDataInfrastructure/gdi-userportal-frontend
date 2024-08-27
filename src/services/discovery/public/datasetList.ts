// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosResponse } from "axios";
import {
  DatasetSearchOptions,
  DatasetsSearchResult,
} from "../types/datasetSearch.types";

export const datasetList = async (
  options: DatasetSearchOptions
): Promise<AxiosResponse<DatasetsSearchResult>> => {
  return await axios.post(
    "/api/datasets",
    { options },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
