// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosInstance } from "axios";
import {
  HarvesterLogsStore,
  HarvesterRunListResult,
  HarvesterRunLog,
  HarvesterRunStatus,
} from "@/app/api/discovery/local-store/harvester-logs/types";
import {
  buildListRunsBody,
  buildRunLogDocumentBody,
  createHarvesterLogsIndexMappings,
} from "@/app/api/discovery/local-store/harvester-logs/queries";
import {
  createOpenSearchClient,
  formatSearchBackendError as formatOpenSearchError,
  isIndexAlreadyExistsError,
  isIndexCreateBlockedError,
} from "@/app/api/discovery/local-store/opensearch/errors";

type SearchBackendSearchResponse = {
  hits?: {
    total?: { value?: number };
    hits?: Array<{ _id: string; _source?: HarvesterRunLog }>;
  };
};

type SearchBackendDocumentResponse = {
  _id: string;
  _source?: HarvesterRunLog;
};

const formatSearchBackendError = (error: unknown): string =>
  formatOpenSearchError(error, "OpenSearch request");

export class OpenSearchHarvesterLogsStore implements HarvesterLogsStore {
  private readonly client: AxiosInstance;
  private readonly indexName: string;
  private initialized = false;

  constructor(params: {
    baseUrl: string;
    indexName: string;
    username?: string;
    password?: string;
    apiKey?: string;
    insecureTls?: boolean;
  }) {
    this.client = createOpenSearchClient(params);
    this.indexName = params.indexName;
  }

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    let initializationError: unknown;
    try {
      await this.client.put(
        `/${this.indexName}`,
        createHarvesterLogsIndexMappings()
      );
    } catch (error) {
      initializationError = error;
    }

    if (!initializationError) {
      this.initialized = true;
      return;
    }

    if (
      !isIndexAlreadyExistsError(initializationError) &&
      !isIndexCreateBlockedError(initializationError)
    ) {
      throw initializationError;
    }

    this.initialized = true;
  }

  async writeRunLog(log: HarvesterRunLog): Promise<void> {
    await this.ensureInitialized();

    try {
      await this.client.put(
        `/${this.indexName}/_doc/${encodeURIComponent(log.runId)}`,
        buildRunLogDocumentBody(log)
      );
    } catch (error) {
      throw new Error(formatSearchBackendError(error));
    }
  }

  async listRuns(
    start: number,
    rows: number,
    status?: HarvesterRunStatus
  ): Promise<HarvesterRunListResult> {
    await this.ensureInitialized();

    let response;
    try {
      response = await this.client.post<SearchBackendSearchResponse>(
        `/${this.indexName}/_search`,
        buildListRunsBody(start, rows, status)
      );
    } catch (error) {
      throw new Error(formatSearchBackendError(error));
    }

    const hits = response.data.hits?.hits ?? [];
    return {
      count: response.data.hits?.total?.value ?? 0,
      results: hits
        .filter((hit): hit is { _id: string; _source: HarvesterRunLog } =>
          Boolean(hit._source)
        )
        .map(
          ({
            _source: { errors, warnings, succeededDatasets, ...summary },
          }) => ({
            ...summary,
            errorCount: errors?.length ?? 0,
            warningCount: warnings?.length ?? 0,
          })
        ),
    };
  }

  async retrieveRun(runId: string): Promise<HarvesterRunLog | null> {
    await this.ensureInitialized();

    try {
      const response = await this.client.get<SearchBackendDocumentResponse>(
        `/${this.indexName}/_doc/${encodeURIComponent(runId)}`
      );

      return response.data._source ?? null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw new Error(formatSearchBackendError(error));
    }
  }
}
