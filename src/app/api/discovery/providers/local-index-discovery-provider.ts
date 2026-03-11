// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getLocalDiscoveryStore } from "@/app/api/discovery/local-store/factory";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { BasePlaceholderDiscoveryProvider } from "@/app/api/discovery/providers/base-placeholder-provider";
import {
  DiscoveryDatasetSearchQuery,
  DiscoveryDatasetsSearchResponse,
  DiscoveryRetrievedDataset,
  DiscoveryValueLabel,
} from "@/app/api/discovery/providers/types";
import formatDatasetLanguage from "@/utils/formatDatasetLanguage";

export class LocalIndexDiscoveryProvider extends BasePlaceholderDiscoveryProvider {
  readonly key = "local-index";

  readonly capabilities = {
    supportsBeaconEnrichment: false,
    supportsGVariants: false,
    supportsFilterEntries: false,
  } as const;

  private readonly store = getLocalDiscoveryStore();

  private mapDatasetLanguages(languages?: string[]): DiscoveryValueLabel[] {
    return (
      languages?.map((language) => ({
        value: language,
        label:
          formatDatasetLanguage(language) ??
          language.split("/").pop() ??
          language,
      })) ?? []
    );
  }

  private mapLocalDataset(
    dataset: LocalDiscoveryDataset
  ): DiscoveryRetrievedDataset {
    return {
      id: dataset.id,
      identifier: dataset.identifier ?? "",
      title: dataset.title,
      description: dataset.description ?? "",
      catalogue: dataset.catalogue ?? "",
      languages: this.mapDatasetLanguages(dataset.languages),
      createdAt: dataset.createdAt,
      modifiedAt: dataset.modifiedAt,
      version: dataset.version,
      hasVersions: dataset.hasVersions,
      versionNotes: dataset.versionNotes,
      publishers: [],
      themes: [],
      keywords: [],
      populationCoverage: dataset.populationCoverage,
      spatialResolutionInMeters: dataset.spatialResolutionInMeters,
      spatialCoverage: dataset.spatialCoverage,
    };
  }

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
      results: response.results.map((dataset) => this.mapLocalDataset(dataset)),
    };
  }

  async retrieveDataset(id: string): Promise<DiscoveryRetrievedDataset> {
    await this.store.ensureInitialized();
    const dataset = await this.store.retrieveDataset(id);
    if (!dataset) {
      throw new Error(`Dataset not found in local index: ${id}`);
    }

    return this.mapLocalDataset(dataset);
  }
}
