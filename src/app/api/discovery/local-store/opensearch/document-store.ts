// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosInstance } from "axios";
import {
  createOpenSearchClient,
  ensureIndexInitialized,
} from "@/app/api/discovery/local-store/opensearch/errors";
import {
  buildBulkUpsertBody,
  buildClearBody,
} from "@/app/api/discovery/local-store/opensearch/queries";

export type OpenSearchStoreParams = {
  baseUrl: string;
  indexName: string;
  username?: string;
  password?: string;
  apiKey?: string;
  insecureTls?: boolean;
};

/** Common lifecycle for a typed OpenSearch document index. */
export abstract class OpenSearchDocumentStore<
  TDocument extends { id: string },
> {
  readonly key = "opensearch";

  protected readonly client: AxiosInstance;
  protected readonly indexName: string;
  private initialized = false;

  constructor(
    params: OpenSearchStoreParams,
    private readonly createMappings: () => { mappings: unknown }
  ) {
    this.client = createOpenSearchClient(params);
    this.indexName = params.indexName;
  }

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await ensureIndexInitialized(
      this.client,
      this.indexName,
      this.createMappings
    );
    this.initialized = true;
  }

  protected async clearDocuments(): Promise<void> {
    await this.ensureInitialized();
    await this.client.post(
      `/${this.indexName}/_delete_by_query`,
      buildClearBody()
    );
  }

  protected async upsertDocuments(documents: TDocument[]): Promise<void> {
    await this.ensureInitialized();
    if (!documents.length) return;

    const response = await this.client.post<{ errors?: boolean }>(
      "/_bulk",
      buildBulkUpsertBody(this.indexName, documents),
      { headers: { "Content-Type": "application/x-ndjson" } }
    );

    if (response.data.errors) {
      throw new Error("OpenSearch bulk upsert reported item-level errors");
    }
  }

  protected async retrieveDocument<TResult>(
    id: string,
    map: (response: { _id: string; _source?: Partial<TDocument> }) => TResult
  ): Promise<TResult | null> {
    await this.ensureInitialized();

    try {
      const response = await this.client.get<{
        _id: string;
        _source?: Partial<TDocument>;
      }>(`/${this.indexName}/_doc/${encodeURIComponent(id)}`);
      return map(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
