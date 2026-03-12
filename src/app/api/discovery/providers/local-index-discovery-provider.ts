// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getLocalDiscoveryStore } from "@/app/api/discovery/local-store/factory";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { BasePlaceholderDiscoveryProvider } from "@/app/api/discovery/providers/base-placeholder-provider";
import {
  DiscoveryDatasetBase,
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
  ): DiscoveryDatasetBase {
    // HealthDCAT-AP can expose multiple spatial resolution values, but the
    // current UI and DDS-facing contract only support a single number.
    const spatialResolutionInMeters = dataset.spatialResolutionInMeters?.[0];
    // HealthDCAT-AP can expose multiple version notes, but the current UI and
    // DDS-facing contract only support a single string.
    const versionNotes = dataset.versionNotes?.[0];

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
      versionNotes,
      publishers: [],
      themes: [],
      keywords: [],
      populationCoverage: dataset.populationCoverage,
      spatialResolutionInMeters,
      spatialCoverage: dataset.spatialCoverage?.map((sc) => ({
        uri: sc.uri ? { value: sc.uri, label: sc.uri } : undefined,
        text: sc.text,
        geom: sc.geom,
        bbox: sc.bbox,
        centroid: sc.centroid,
      })),
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

    return {
      ...this.mapLocalDataset(dataset),
    };
  }
}
