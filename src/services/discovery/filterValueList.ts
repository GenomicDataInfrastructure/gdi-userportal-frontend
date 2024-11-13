// SPDX-FileCopyrightText: 2024 PNED G.I.E.

// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosResponse } from "axios";
import { ValueLabel } from "./types/datasetSearch.types";
import { FilterValueType } from "./types/dataset.types";

export const makeFilterValuesList = (discoveryUrl: string) => {
  return async (key: FilterValueType): Promise<AxiosResponse<ValueLabel[]>> => {
    return await axios.get(`${discoveryUrl}/api/v1/filters/${key}/values`);
  };
};
