// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getLocalDiscoveryStore } from "@/app/api/discovery/local-store/factory";
import { BasePlaceholderDiscoveryProvider } from "@/app/api/discovery/providers/base-placeholder-provider";
import {
  DiscoveryDatasetSearchQuery,
  DiscoveryDatasetsSearchResponse,
  DiscoveryRetrievedDataset,
} from "@/app/api/discovery/providers/types";

export class LocalIndexDiscoveryProvider extends BasePlaceholderDiscoveryProvider {
  readonly key = "local-index";

  readonly capabilities = {
    supportsBeaconEnrichment: false,
    supportsGVariants: false,
    supportsFilterEntries: false,
  } as const;

  private readonly store = getLocalDiscoveryStore();

  async retrieveFilters(_headers: Record<string, string>) {
    return [];
  }

  async retrieveFilterValues(_key: string, _headers: Record<string, string>) {
    return [];
  }

  async searchDatasets(
    options: DiscoveryDatasetSearchQuery,
    _headers: Record<string, string>
  ): Promise<DiscoveryDatasetsSearchResponse> {
    await this.store.ensureInitialized();
    const response = await this.store.searchDatasets({
      query: options.query,
      start: options.start,
      rows: options.rows,
    });

    return {
      count: response.count,
      results: response.results.map((dataset) => ({
        id: dataset.id,
        title: dataset.title,
        description: "",
      })),
    };
  }

  async retrieveDataset(id: string): Promise<DiscoveryRetrievedDataset> {
    await this.store.ensureInitialized();
    const dataset = await this.store.retrieveDataset(id);
    if (!dataset) {
      throw new Error(`Dataset not found in local index: ${id}`);
    }

    return {
      id: dataset.id,
      title: dataset.title,
      description: "",
    };
  }
}
