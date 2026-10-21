// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryAiModel,
  LocalDiscoveryAiModelSearchResult,
  LocalDiscoveryAiModelStore,
  LocalDiscoverySearchOptions,
  StoredDocumentSearchResponse,
} from "@/app/api/discovery/local-store/types";
import {
  aiModelSearchFieldSets,
  buildSearchBody,
  createAiModelIndexMappings,
} from "@/app/api/discovery/local-store/opensearch/queries";
import {
  mapAiModelSearchResponse,
  mapGetAiModelDocumentResponse,
} from "@/app/api/discovery/local-store/opensearch/ai-model-mappers";
import { formatSearchBackendError as formatOpenSearchError } from "@/app/api/discovery/local-store/opensearch/errors";
import {
  OpenSearchDocumentStore,
  OpenSearchStoreParams,
} from "@/app/api/discovery/local-store/opensearch/document-store";

type SearchBackendAiModelSearchResponse = StoredDocumentSearchResponse<
  Partial<LocalDiscoveryAiModel>
>;

const formatSearchBackendError = (error: unknown): string =>
  formatOpenSearchError(error, "OpenSearch AI Model search request");

/**
 * Same upsert/clear/search lifecycle as OpenSearchDiscoveryStore, stored in
 * AI Model's own index rather than Dataset's.
 */
export class OpenSearchAiModelStore
  extends OpenSearchDocumentStore<LocalDiscoveryAiModel>
  implements LocalDiscoveryAiModelStore
{
  constructor(params: OpenSearchStoreParams) {
    super(params, createAiModelIndexMappings);
  }

  async clearAiModels(): Promise<void> {
    await this.clearDocuments();
  }

  async searchAiModels(
    options: LocalDiscoverySearchOptions
  ): Promise<LocalDiscoveryAiModelSearchResult> {
    await this.ensureInitialized();
    const requestBody = buildSearchBody(options, aiModelSearchFieldSets);

    let response;
    try {
      response = await this.client.post<SearchBackendAiModelSearchResponse>(
        `/${this.indexName}/_search`,
        requestBody
      );
    } catch (error) {
      throw new Error(formatSearchBackendError(error));
    }

    return mapAiModelSearchResponse(response.data);
  }

  async retrieveAiModel(id: string): Promise<LocalDiscoveryAiModel | null> {
    return this.retrieveDocument(id, mapGetAiModelDocumentResponse);
  }

  async upsertAiModels(aiModels: LocalDiscoveryAiModel[]): Promise<void> {
    await this.upsertDocuments(aiModels);
  }
}
