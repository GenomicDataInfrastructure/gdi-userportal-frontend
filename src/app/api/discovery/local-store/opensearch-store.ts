// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryValueLabel,
  LocalDiscoveryDataset,
  LocalDiscoverySearchOptions,
  LocalDiscoverySearchResult,
  LocalDiscoveryStore,
} from "@/app/api/discovery/local-store/types";
import {
  SearchBackendCountResponse,
  SearchBackendTermsAggregationResponse,
  SearchBackendSearchResponse,
} from "@/app/api/discovery/local-store/opensearch/types";
import {
  buildFilterValuesBody,
  buildSearchBody,
  createIndexMappings,
} from "@/app/api/discovery/local-store/opensearch/queries";
import {
  mapGetDocumentResponse,
  mapSearchResponse,
} from "@/app/api/discovery/local-store/opensearch/mappers";
import { formatSearchBackendError as formatOpenSearchError } from "@/app/api/discovery/local-store/opensearch/errors";
import { getLocalFilterDefinition } from "@/app/api/discovery/local-store/filter-registry";
import {
  OpenSearchDocumentStore,
  OpenSearchStoreParams,
} from "@/app/api/discovery/local-store/opensearch/document-store";

const formatSearchBackendError = (error: unknown): string =>
  formatOpenSearchError(error, "OpenSearch search request");

export class OpenSearchDiscoveryStore
  extends OpenSearchDocumentStore<LocalDiscoveryDataset>
  implements LocalDiscoveryStore
{
  constructor(params: OpenSearchStoreParams) {
    super(params, createIndexMappings);
  }

  async clearDatasets(): Promise<void> {
    await this.clearDocuments();
  }

  async hasFilterValues(key: string): Promise<boolean> {
    await this.ensureInitialized();

    const filterDefinition = getLocalFilterDefinition(key);
    const field = filterDefinition?.field;
    if (!field) {
      return false;
    }

    let response;
    try {
      response = await this.client.post<SearchBackendCountResponse>(
        `/${this.indexName}/_count`,
        {
          query: {
            exists: {
              field,
            },
          },
        }
      );
    } catch (error) {
      throw new Error(formatSearchBackendError(error));
    }

    return Boolean(response.data.count);
  }

  async retrieveFilterValues(key: string): Promise<LocalDiscoveryValueLabel[]> {
    await this.ensureInitialized();

    const filterDefinition = getLocalFilterDefinition(key);
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

        return {
          ...mappedValue,
          count: bucket.doc_count,
        };
      }) ?? [];

    return aggregatedValues.filter(
      (value): value is NonNullable<(typeof aggregatedValues)[number]> =>
        value !== null
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
    return this.retrieveDocument(id, mapGetDocumentResponse);
  }

  async upsertDatasets(datasets: LocalDiscoveryDataset[]): Promise<void> {
    await this.upsertDocuments(datasets);
  }
}
