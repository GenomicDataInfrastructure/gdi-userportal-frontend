// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosInstance } from "axios";
import https from "node:https";
import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchOptions,
  LocalDiscoverySearchResult,
  LocalDiscoveryStore,
} from "@/app/api/discovery/local-store/types";
import {
  SearchBackendDocumentResponse,
  SearchBackendSearchResponse,
} from "@/app/api/discovery/local-store/opensearch/types";
import {
  buildBulkUpsertBody,
  buildClearBody,
  buildSearchBody,
  createIndexMappings,
} from "@/app/api/discovery/local-store/opensearch/queries";
import {
  mapGetDocumentResponse,
  mapSearchResponse,
} from "@/app/api/discovery/local-store/opensearch/mappers";
import { isIndexAlreadyExistsError } from "@/app/api/discovery/local-store/opensearch/errors";

const formatSearchBackendError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : String(error);
  }

  const status = error.response?.status;
  const reason =
    error.response?.data &&
    typeof error.response.data === "object" &&
    "error" in error.response.data
      ? JSON.stringify((error.response.data as { error?: unknown }).error)
      : null;

  if (status && reason) {
    return `OpenSearch search request failed (${status}): ${reason}`;
  }

  if (status) {
    return `OpenSearch search request failed (${status}): ${error.message}`;
  }

  return error.message;
};

export class OpenSearchDiscoveryStore implements LocalDiscoveryStore {
  readonly key = "opensearch";

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
    const headers: Record<string, string> = {};
    if (params.apiKey) {
      headers.Authorization = `ApiKey ${params.apiKey}`;
    }

    this.client = axios.create({
      baseURL: params.baseUrl,
      headers,
      httpsAgent: params.insecureTls
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined,
      auth:
        params.username && params.password
          ? { username: params.username, password: params.password }
          : undefined,
    });
    this.indexName = params.indexName;
  }

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.client.put(`/${this.indexName}`, createIndexMappings());
    } catch (error) {
      if (!isIndexAlreadyExistsError(error)) {
        throw error;
      }
      try {
        await this.client.put(
          `/${this.indexName}/_mapping`,
          createIndexMappings().mappings
        );
      } catch (mappingError) {
        console.warn(
          `[OpenSearch] Could not update mapping for index "${this.indexName}" — ` +
            `one or more field types may have changed. Delete and recreate the index to apply the new schema. ` +
            `Error: ${formatSearchBackendError(mappingError)}`
        );
      }
    }

    this.initialized = true;
  }

  async clearDatasets(): Promise<void> {
    await this.ensureInitialized();

    await this.client.post(
      `/${this.indexName}/_delete_by_query`,
      buildClearBody()
    );
  }

  async searchDatasets(
    options: LocalDiscoverySearchOptions
  ): Promise<LocalDiscoverySearchResult> {
    await this.ensureInitialized();
    const requestBody = buildSearchBody(options);

    let response;
    try {
      response = await this.client.post<SearchBackendSearchResponse>(
        `/${this.indexName}/_search`,
        requestBody
      );
    } catch (error) {
      throw new Error(formatSearchBackendError(error));
    }

    return mapSearchResponse(response.data);
  }

  async retrieveDataset(id: string): Promise<LocalDiscoveryDataset | null> {
    await this.ensureInitialized();

    try {
      const response = await this.client.get<SearchBackendDocumentResponse>(
        `/${this.indexName}/_doc/${encodeURIComponent(id)}`
      );

      return mapGetDocumentResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  }

  async upsertDatasets(datasets: LocalDiscoveryDataset[]): Promise<void> {
    await this.ensureInitialized();
    if (!datasets.length) return;
    const body = buildBulkUpsertBody(this.indexName, datasets);

    const response = await this.client.post<{ errors?: boolean }>(
      "/_bulk",
      body,
      {
        headers: { "Content-Type": "application/x-ndjson" },
      }
    );

    if (response.data.errors) {
      throw new Error("OpenSearch bulk upsert reported item-level errors");
    }
  }
}
