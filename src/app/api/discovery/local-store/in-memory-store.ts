// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchOptions,
  LocalDiscoverySearchResult,
  LocalDiscoveryStore,
} from "@/app/api/discovery/local-store/types";

export class InMemoryDiscoveryStore implements LocalDiscoveryStore {
  readonly key = "memory";

  private readonly datasets = new Map<string, LocalDiscoveryDataset>();

  async ensureInitialized(): Promise<void> {
    return;
  }

  async searchDatasets(
    options: LocalDiscoverySearchOptions
  ): Promise<LocalDiscoverySearchResult> {
    const query = options.query?.trim().toLowerCase();
    const start = options.start ?? 0;
    const rows = options.rows ?? 20;

    const all = Array.from(this.datasets.values());
    const filtered = query
      ? all.filter((dataset) => dataset.title.toLowerCase().includes(query))
      : all;

    return {
      count: filtered.length,
      results: filtered.slice(start, start + rows),
    };
  }

  async retrieveDataset(id: string): Promise<LocalDiscoveryDataset | null> {
    return this.datasets.get(id) ?? null;
  }

  async upsertDatasets(datasets: LocalDiscoveryDataset[]): Promise<void> {
    for (const dataset of datasets) {
      this.datasets.set(dataset.id, dataset);
    }
  }
}
