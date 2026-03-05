// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { discoveryClient } from "@/app/api/shared/client";
import {
  DatasetSearchQuery,
  GVariantSearchQuery,
} from "@/app/api/discovery/open-api/schemas";
import {
  DiscoveryDatasetSearchQuery,
  DiscoveryFilter,
  DiscoveryGVariantSearchQuery,
  DiscoveryGVariantSearchResult,
  DiscoveryProvider,
  DiscoveryRetrievedDataset,
  DiscoveryValueLabel,
  DiscoveryDatasetsSearchResponse,
} from "@/app/api/discovery/providers/types";

export class DdsDiscoveryProvider implements DiscoveryProvider {
  readonly key = "dds";

  readonly capabilities = {
    supportsBeaconEnrichment: true,
    supportsGVariants: true,
    supportsFilterEntries: true,
  } as const;

  async retrieveFilters(
    headers: Record<string, string>
  ): Promise<DiscoveryFilter[]> {
    const response = await discoveryClient.retrieve_filters({ headers });
    return response as DiscoveryFilter[];
  }

  async retrieveFilterValues(
    key: string,
    headers: Record<string, string>
  ): Promise<DiscoveryValueLabel[]> {
    const response = await discoveryClient.retrieve_filter_values({
      params: { key },
      headers,
    });
    return response as DiscoveryValueLabel[];
  }

  async searchDatasets(
    options: DiscoveryDatasetSearchQuery,
    headers: Record<string, string>
  ): Promise<DiscoveryDatasetsSearchResponse> {
    const response = await discoveryClient.dataset_search(
      options as DatasetSearchQuery,
      { headers }
    );
    return response as DiscoveryDatasetsSearchResponse;
  }

  async retrieveDataset(id: string): Promise<DiscoveryRetrievedDataset> {
    const response = await discoveryClient.retrieve_dataset({
      params: { id },
    });
    return response as DiscoveryRetrievedDataset;
  }

  async retrieveDatasetInFormat(
    id: string,
    format: "rdf" | "ttl" | "jsonld",
    headers: Record<string, string>
  ): Promise<Blob> {
    const response = await discoveryClient.retrieve_dataset_in_format({
      params: {
        "id.": id,
        id,
        format,
      },
      headers,
      responseType: "blob",
    });

    return response as unknown as Blob;
  }

  async searchGVariants(
    options: DiscoveryGVariantSearchQuery
  ): Promise<DiscoveryGVariantSearchResult[]> {
    const response = await discoveryClient.searchGenomicVariants(
      options as GVariantSearchQuery
    );
    return response as DiscoveryGVariantSearchResult[];
  }
}
