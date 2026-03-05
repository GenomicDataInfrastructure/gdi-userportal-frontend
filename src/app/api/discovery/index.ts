// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import {
  DatasetSearchQuery,
  DatasetsSearchResponse,
  Filter,
  GVariantSearchQuery,
  GVariantsSearchResponse,
  RetrievedDataset,
  ValueLabel,
} from "@/app/api/discovery/open-api/schemas";
import { getDiscoveryProvider } from "@/app/api/discovery/providers/factory";
import { createHeaders } from "@/app/api/shared/headers";

const discoveryProvider = getDiscoveryProvider();

export const getDiscoveryCapabilitiesApi = async () => {
  return discoveryProvider.capabilities;
};

export const retrieveFiltersApi = async (): Promise<Filter[]> => {
  const headers = await createHeaders();
  return (await discoveryProvider.retrieveFilters(headers)) as Filter[];
};

export const retrieveFilterValuesApi = async (
  key: string
): Promise<ValueLabel[]> => {
  const headers = await createHeaders();
  return (await discoveryProvider.retrieveFilterValues(
    key,
    headers
  )) as ValueLabel[];
};

export const searchDatasetsApi = async (
  options: DatasetSearchQuery
): Promise<DatasetsSearchResponse> => {
  const headers = await createHeaders();
  const response = (await discoveryProvider.searchDatasets(
    options,
    headers
  )) as DatasetsSearchResponse;
  return response;
};

export const retrieveDatasetApi = async (
  id: string
): Promise<RetrievedDataset> => {
  const dataset = (await discoveryProvider.retrieveDataset(
    id
  )) as RetrievedDataset;
  return dataset;
};

export const retrieveDatasetInSpecifiedFormat = async (
  id: string,
  format: "rdf" | "ttl" | "jsonld"
): Promise<Blob> => {
  const headers = await createHeaders();

  return (await discoveryProvider.retrieveDatasetInFormat(
    id,
    format,
    headers
  )) as Blob;
};

export const searchGVariantsApi = async (
  options: GVariantSearchQuery
): Promise<GVariantsSearchResponse[]> => {
  if (!discoveryProvider.capabilities.supportsGVariants) {
    throw new Error(
      `The configured discovery provider "${discoveryProvider.key}" does not support genomic variant search`
    );
  }

  return (await discoveryProvider.searchGVariants(
    options
  )) as GVariantsSearchResponse[];
};
