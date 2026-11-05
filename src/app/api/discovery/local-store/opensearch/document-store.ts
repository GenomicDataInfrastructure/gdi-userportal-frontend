// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosInstance } from "axios";
import {
  createOpenSearchClient,
  ensureIndexInitialized,
  formatSearchBackendError as formatOpenSearchError,
} from "@/app/api/discovery/local-store/opensearch/errors";
import {
  buildBulkUpsertBody,
  buildClearBody,
  buildFilterValuesBody,
} from "@/app/api/discovery/local-store/opensearch/queries";
import {
  SearchBackendCountResponse,
  SearchBackendTermsAggregationResponse,
} from "@/app/api/discovery/local-store/opensearch/types";
import { LocalFilterDefinition } from "@/app/api/discovery/local-store/filter-registry";
import { LocalDiscoveryValueLabel } from "@/app/api/discovery/local-store/types";

export type OpenSearchStoreParams = {
  baseUrl: string;
  indexName: string;
  username?: string;
  password?: string;
  apiKey?: string;
  insecureTls?: boolean;
};

const formatSearchBackendError = (error: unknown): string =>
  formatOpenSearchError(error, "OpenSearch search request");

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

  protected async hasFilterValues(
    key: string,
    getFilterDefinition: (key: string) => LocalFilterDefinition | undefined
  ): Promise<boolean> {
    await this.ensureInitialized();

    const field = getFilterDefinition(key)?.field;
    if (!field) {
      return false;
    }

    let response;
    try {
      response = await this.client.post<SearchBackendCountResponse>(
        `/${this.indexName}/_count`,
        { query: { exists: { field } } }
      );
    } catch (error) {
      throw new Error(formatSearchBackendError(error));
    }

    return Boolean(response.data.count);
  }

  protected async retrieveFilterValues(
    key: string,
    getFilterDefinition: (key: string) => LocalFilterDefinition | undefined
  ): Promise<LocalDiscoveryValueLabel[]> {
    await this.ensureInitialized();

    const filterDefinition = getFilterDefinition(key);
    if (
      filterDefinition?.type !== "DROPDOWN" ||
      !filterDefinition.aggregation
    ) {
      return [];
    }

    const requestBody = buildFilterValuesBody(
      filterDefinition.aggregation.field,
      filterDefinition.aggregation.size
    );

    let response;
    try {
      response = await this.client.post<SearchBackendTermsAggregationResponse>(
        `/${this.indexName}/_search`,
        requestBody
      );
    } catch (error) {
      throw new Error(formatSearchBackendError(error));
    }

    const aggregatedValues =
      response.data.aggregations?.values?.buckets?.map((bucket) => {
        const mappedValue = filterDefinition.aggregation?.mapBucket
          ? filterDefinition.aggregation.mapBucket(bucket.key)
          : { value: bucket.key, label: bucket.key };

        if (!mappedValue.value || !mappedValue.label) {
          return null;
        }

        return { ...mappedValue, count: bucket.doc_count };
      }) ?? [];

    return aggregatedValues.filter(
      (value): value is NonNullable<(typeof aggregatedValues)[number]> =>
        value !== null
    );
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
