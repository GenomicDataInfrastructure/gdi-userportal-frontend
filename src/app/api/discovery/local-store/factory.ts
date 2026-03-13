// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { OpenSearchDiscoveryStore } from "@/app/api/discovery/local-store/opensearch-store";
import {
  LocalDiscoveryDataset,
  LocalDiscoveryStore,
} from "@/app/api/discovery/local-store/types";

export type LocalDiscoveryStoreKey = "opensearch";

const defaultStoreKey: LocalDiscoveryStoreKey = "opensearch";

const createStoreByKey = (key: LocalDiscoveryStoreKey): LocalDiscoveryStore => {
  if (key === "opensearch") {
    const baseUrl = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
    const indexName =
      process.env.OPENSEARCH_DISCOVERY_INDEX ?? "discovery_datasets";
    const insecureTls =
      process.env.OPENSEARCH_TLS_INSECURE === "true" ||
      process.env.OPENSEARCH_TLS_INSECURE === "1";
    return new OpenSearchDiscoveryStore({
      baseUrl,
      indexName,
      username: process.env.OPENSEARCH_USERNAME,
      password: process.env.OPENSEARCH_PASSWORD,
      apiKey: process.env.OPENSEARCH_API_KEY,
      insecureTls,
    });
  }

  throw new Error(`Unsupported local discovery store key: ${key}`);
};

let cachedStore: LocalDiscoveryStore | null = null;

export const getLocalDiscoveryStore = (): LocalDiscoveryStore => {
  if (cachedStore) return cachedStore;
  cachedStore = createStoreByKey(defaultStoreKey);
  return cachedStore;
};

export const upsertLocalDiscoveryDatasets = async (
  datasets: LocalDiscoveryDataset[]
): Promise<void> => {
  const store = getLocalDiscoveryStore();
  await store.upsertDatasets(datasets);
};

export const clearLocalDiscoveryDatasets = async (): Promise<void> => {
  const store = getLocalDiscoveryStore();
  await store.clearDatasets();
};
