// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { OpenSearchAiModelStore } from "@/app/api/discovery/local-store/opensearch/ai-model-store";
import {
  LocalDiscoveryAiModel,
  LocalDiscoveryAiModelStore,
} from "@/app/api/discovery/local-store/types";

const createOpenSearchAiModelStore = (): LocalDiscoveryAiModelStore => {
  const baseUrl = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
  const indexName =
    process.env.OPENSEARCH_AI_MODEL_INDEX ?? "discovery_ai_models";
  const insecureTls =
    process.env.OPENSEARCH_TLS_INSECURE === "true" ||
    process.env.OPENSEARCH_TLS_INSECURE === "1";

  return new OpenSearchAiModelStore({
    baseUrl,
    indexName,
    username: process.env.OPENSEARCH_USERNAME,
    password: process.env.OPENSEARCH_PASSWORD,
    apiKey: process.env.OPENSEARCH_API_KEY,
    insecureTls,
  });
};

let cachedStore: LocalDiscoveryAiModelStore | null = null;

export const getLocalAiModelStore = (): LocalDiscoveryAiModelStore => {
  if (cachedStore) return cachedStore;
  cachedStore = createOpenSearchAiModelStore();
  return cachedStore;
};

export const upsertLocalAiModels = async (
  aiModels: LocalDiscoveryAiModel[]
): Promise<void> => {
  const store = getLocalAiModelStore();
  await store.upsertAiModels(aiModels);
};

export const clearLocalAiModels = async (): Promise<void> => {
  const store = getLocalAiModelStore();
  await store.clearAiModels();
};
