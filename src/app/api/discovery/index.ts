// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { discoveryClient } from "@/app/api/shared/client";
import {
  DatasetSearchQuery,
  GVariantSearchQuery,
} from "@/app/api/discovery/open-api/schemas";
import { createHeaders } from "@/app/api/shared/headers";

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
  return await discoveryClient.dataset_search(options, { headers });
};

export const retrieveDatasetApi = async (id: string) => {
  return await discoveryClient.retrieve_dataset({ params: { id } });
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
  const headers = await createHeaders();
  return await discoveryClient.searchGenomicVariants(options, { headers });
};
