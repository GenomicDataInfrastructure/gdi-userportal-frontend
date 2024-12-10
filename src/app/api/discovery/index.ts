// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { discoveryClient } from "@/app/api/shared/client";
import { DatasetSearchQuery } from "@/app/api/discovery/open-api/schemas";
import { createHeaders } from "@/app/api/shared/headers";

export const retrieveFiltersApi = async () => {
  const headers = await createHeaders();
  const filters = await discoveryClient.retrieve_filters({ headers });
  return filters;
};

export const retrieveFilterValuesApi = async (key: string) => {
  const headers = await createHeaders();
  const dataset = await discoveryClient.retrieve_filter_values({
    params: { key },
    headers,
  });
  return dataset;
};

export const searchDatasetsApi = async (options: DatasetSearchQuery) => {
  const headers = await createHeaders();
  const results = await discoveryClient.dataset_search(options, { headers });
  return results;
};

export const retrieveDatasetApi = async (id: string) => {
  const dataset = await discoveryClient.retrieve_dataset({ params: { id } });
  return dataset;
};

export const retrieveDatasetInSpecifiedFormat = async (
  id: string,
  format: "rdf" | "ttl" | "jsonld"
) => {
  const headers = await createHeaders();

  const response = await discoveryClient.retrieve_dataset_in_format({
    params: {
      "id.": id,
      id,
      format,
    },
    headers,
    responseType: "blob",
  });

  return response;
};
