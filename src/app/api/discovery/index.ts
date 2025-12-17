// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import {
  DatasetSearchQuery,
  GVariantSearchQuery,
} from "@/app/api/discovery/open-api/schemas";
import { discoveryClient } from "@/app/api/shared/client";
import { createHeaders } from "@/app/api/shared/headers";
import { applyMockData } from "@/utils/mockDatasets";

const ENABLE_MOCK_DATA = process.env.ENABLE_MOCK_CONFORMS_TO === "true";

export const retrieveFiltersApi = async () => {
  const headers = await createHeaders();
  return await discoveryClient.retrieve_filters({ headers });
};

export const retrieveFilterValuesApi = async (key: string) => {
  const headers = await createHeaders();
  return await discoveryClient.retrieve_filter_values({
    params: { key },
    headers,
  });
};

export const searchDatasetsApi = async (options: DatasetSearchQuery) => {
  const headers = await createHeaders();
  const response = await discoveryClient.dataset_search(options, { headers });

  if (!ENABLE_MOCK_DATA || !response.results) {
    return response;
  }

  return {
    ...response,
    results: response.results.map(applyMockData),
  };
};

export const retrieveDatasetApi = async (id: string) => {
  const dataset = await discoveryClient.retrieve_dataset({ params: { id } });
  return !ENABLE_MOCK_DATA ? dataset : applyMockData(dataset);
};

export const retrieveDatasetInSpecifiedFormat = async (
  id: string,
  format: "rdf" | "ttl" | "jsonld"
) => {
  const headers = await createHeaders();

  return await discoveryClient.retrieve_dataset_in_format({
    params: {
      "id.": id,
      id,
      format,
    },
    headers,
    responseType: "blob",
  });
};

export const searchGVariantsApi = async (options: GVariantSearchQuery) => {
  return await discoveryClient.searchGenomicVariants(options);
};
