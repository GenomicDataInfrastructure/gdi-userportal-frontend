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
import { SearchBackendSearchResponse } from "@/app/api/discovery/local-store/opensearch/types";
import {
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
    return super.hasFilterValues(key, getLocalFilterDefinition);
  }

  async retrieveFilterValues(key: string): Promise<LocalDiscoveryValueLabel[]> {
    return super.retrieveFilterValues(key, getLocalFilterDefinition);
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
