// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { OpenSearchHarvesterLogsStore } from "@/app/api/discovery/local-store/harvester-logs/opensearch-harvester-logs-store";
import {
  HarvesterLogsStore,
  HarvesterRunListResult,
  HarvesterRunLog,
  HarvesterRunStatus,
} from "@/app/api/discovery/local-store/harvester-logs/types";

const createOpenSearchHarvesterLogsStore = (): HarvesterLogsStore => {
  const baseUrl = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
  const indexName =
    process.env.OPENSEARCH_HARVESTER_LOGS_INDEX ?? "harvester_logs";
  const insecureTls =
    process.env.OPENSEARCH_TLS_INSECURE === "true" ||
    process.env.OPENSEARCH_TLS_INSECURE === "1";

  return new OpenSearchHarvesterLogsStore({
    baseUrl,
    indexName,
    username: process.env.OPENSEARCH_USERNAME,
    password: process.env.OPENSEARCH_PASSWORD,
    apiKey: process.env.OPENSEARCH_API_KEY,
    insecureTls,
  });
};

let cachedStore: HarvesterLogsStore | null = null;

export const getHarvesterLogsStore = (): HarvesterLogsStore => {
  if (cachedStore) return cachedStore;
  cachedStore = createOpenSearchHarvesterLogsStore();
  return cachedStore;
};

export const isHarvesterLoggingEnabled = (): boolean =>
  process.env.HARVEST_LOGGING_ENABLED?.trim().toLowerCase() === "true";

export const writeHarvesterRunLog = async (
  log: HarvesterRunLog
): Promise<void> => {
  const store = getHarvesterLogsStore();
  await store.writeRunLog(log);
};

export const listHarvesterRuns = async (
  start: number,
  rows: number,
  status?: HarvesterRunStatus
): Promise<HarvesterRunListResult> => {
  const store = getHarvesterLogsStore();
  return store.listRuns(start, rows, status);
};

export const retrieveHarvesterRun = async (
  runId: string
): Promise<HarvesterRunLog | null> => {
  const store = getHarvesterLogsStore();
  return store.retrieveRun(runId);
};
