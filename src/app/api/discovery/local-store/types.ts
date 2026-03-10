// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export interface LocalDiscoveryDataset {
  id: string;
  identifier?: string;
  title: string;
  description?: string;
  catalogue?: string;
  languages?: string[];
}

export interface LocalDiscoverySearchOptions {
  query?: string;
  start?: number;
  rows?: number;
}

export interface LocalDiscoverySearchResult {
  count: number;
  results: LocalDiscoveryDataset[];
}

export interface LocalDiscoveryStore {
  readonly key: string;
  ensureInitialized: () => Promise<void>;
  clearDatasets: () => Promise<void>;
  searchDatasets: (
    options: LocalDiscoverySearchOptions
  ) => Promise<LocalDiscoverySearchResult>;
  retrieveDataset: (id: string) => Promise<LocalDiscoveryDataset | null>;
  upsertDatasets: (datasets: LocalDiscoveryDataset[]) => Promise<void>;
}
