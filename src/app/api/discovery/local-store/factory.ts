// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ElasticsearchDiscoveryStore } from "@/app/api/discovery/local-store/elasticsearch-store";
import {
  LocalDiscoveryDataset,
  LocalDiscoveryStore,
} from "@/app/api/discovery/local-store/types";

export type LocalDiscoveryStoreKey = "elasticsearch";

const defaultStoreKey: LocalDiscoveryStoreKey = "elasticsearch";

export const resolveLocalDiscoveryStoreKey = (
  keyFromEnv: string | undefined
): LocalDiscoveryStoreKey => {
  if (!keyFromEnv) return defaultStoreKey;

  const normalized = keyFromEnv.toLowerCase();
  if (normalized === "elasticsearch") {
    return normalized;
  }

  throw new Error(
    `Unsupported LOCAL_DISCOVERY_STORE "${keyFromEnv}". Supported values: elasticsearch`
  );
};

const createStoreByKey = (key: LocalDiscoveryStoreKey): LocalDiscoveryStore => {
  if (key === "elasticsearch") {
    const baseUrl = process.env.ELASTICSEARCH_URL ?? "http://localhost:9200";
    const indexName =
      process.env.ELASTICSEARCH_DISCOVERY_INDEX ?? "discovery_datasets";
    const insecureTls =
      process.env.ELASTICSEARCH_TLS_INSECURE === "true" ||
      process.env.ELASTICSEARCH_TLS_INSECURE === "1";
    return new ElasticsearchDiscoveryStore({
      baseUrl,
      indexName,
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
      apiKey: process.env.ELASTICSEARCH_API_KEY,
      insecureTls,
    });
  }

  throw new Error(`Unsupported local discovery store key: ${key}`);
};

let cachedStore: LocalDiscoveryStore | null = null;

export const getLocalDiscoveryStore = (): LocalDiscoveryStore => {
  if (cachedStore) return cachedStore;
  const key = resolveLocalDiscoveryStoreKey(process.env.LOCAL_DISCOVERY_STORE);
  cachedStore = createStoreByKey(key);
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
