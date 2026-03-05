// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

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

export abstract class BasePlaceholderDiscoveryProvider implements DiscoveryProvider {
  abstract readonly key: string;
  abstract readonly capabilities: DiscoveryProvider["capabilities"];

  protected createNotImplementedError(operation: string): Error {
    return new Error(
      `Discovery provider "${this.key}" does not implement "${operation}" yet`
    );
  }

  async retrieveFilters(
    _headers: Record<string, string>
  ): Promise<DiscoveryFilter[]> {
    throw this.createNotImplementedError("retrieveFilters");
  }

  async retrieveFilterValues(
    _key: string,
    _headers: Record<string, string>
  ): Promise<DiscoveryValueLabel[]> {
    throw this.createNotImplementedError("retrieveFilterValues");
  }

  async searchDatasets(
    _options: DiscoveryDatasetSearchQuery,
    _headers: Record<string, string>
  ): Promise<DiscoveryDatasetsSearchResponse> {
    throw this.createNotImplementedError("searchDatasets");
  }

  async retrieveDataset(_id: string): Promise<DiscoveryRetrievedDataset> {
    throw this.createNotImplementedError("retrieveDataset");
  }

  async retrieveDatasetInFormat(
    _id: string,
    _format: "rdf" | "ttl" | "jsonld",
    _headers: Record<string, string>
  ): Promise<Blob> {
    throw this.createNotImplementedError("retrieveDatasetInFormat");
  }

  async searchGVariants(
    _options: DiscoveryGVariantSearchQuery
  ): Promise<DiscoveryGVariantSearchResult[]> {
    throw this.createNotImplementedError("searchGVariants");
  }
}
