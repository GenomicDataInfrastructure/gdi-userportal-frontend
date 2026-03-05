// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { InMemoryDiscoveryStore } from "@/app/api/discovery/local-store/in-memory-store";
import {
  LocalDiscoveryDataset,
  LocalDiscoveryStore,
} from "@/app/api/discovery/local-store/types";

export type LocalDiscoveryStoreKey = "memory";

const defaultStoreKey: LocalDiscoveryStoreKey = "memory";

export const resolveLocalDiscoveryStoreKey = (
  keyFromEnv: string | undefined
): LocalDiscoveryStoreKey => {
  if (!keyFromEnv) return defaultStoreKey;

  const normalized = keyFromEnv.toLowerCase();
  if (normalized === "memory") {
    return normalized;
  }

  throw new Error(
    `Unsupported LOCAL_DISCOVERY_STORE "${keyFromEnv}". Supported values: memory`
  );
};

const createStoreByKey = (key: LocalDiscoveryStoreKey): LocalDiscoveryStore => {
  if (key !== "memory") {
    throw new Error(`Unsupported local discovery store key: ${key}`);
  }
  return new InMemoryDiscoveryStore();
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
