// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from "@/app/api/auth/auth.types";
import axios, { AxiosResponse } from "axios";
import https from "https";
import {
  DatasetSearchOptions,
  DatasetSearchQuery,
  DatasetsSearchResponse,
} from "./types/datasetSearch.types";
import { createHeaders } from "./utils";

const axiosInstance = axios.create({
  baseURL: process.env.API_URL || "",
});

if (process.env.NODE_IGNORE_SSL) {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  axiosInstance.defaults.httpsAgent = httpsAgent;
  console.log("Development mode: RejectUnauthorized is disabled.");
}

export const makeDatasetList = (discoveryUrl: string) => {
  return async (
    options: DatasetSearchOptions,
    session?: ExtendedSession
  ): Promise<AxiosResponse<DatasetsSearchResponse>> => {
    const datasetSearchQuery = {
      start: options?.offset ?? 0,
      rows: options?.limit ?? 10,
      query: options?.query,
      sort: options?.sort,
      facets: options.facets,
      operator: options.operator,
    } as DatasetSearchQuery;

    try {
      return await axiosInstance.post<DatasetsSearchResponse>(
        `${discoveryUrl}/api/v1/datasets/search`,
        datasetSearchQuery,
        {
          headers: await createHeaders(session),
        }
      );
    } catch (exception) {
      if (axios.isAxiosError(exception)) {
        console.log("Error Status:", exception.response?.status);
        console.log("Error Headers:", exception.response?.headers);
        console.log("Error Data:", exception.response?.data);
      } else {
        console.log("Non-Axios Error:", exception);
      }
      throw exception;
    }
  };
};
