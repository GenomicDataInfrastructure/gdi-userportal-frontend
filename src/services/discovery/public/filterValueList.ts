// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosResponse } from "axios";
import { ValueLabel } from "../types/datasetSearch.types";
import { FilterValueType } from "../types/dataset.types";

export const filterValuesList = async (
  key: FilterValueType
): Promise<AxiosResponse<ValueLabel[]>> => {
  return await axios.get(`/api/filters/${key}`);
};
