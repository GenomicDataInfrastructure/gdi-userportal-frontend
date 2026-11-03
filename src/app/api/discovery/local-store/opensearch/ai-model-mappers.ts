// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryAiModel,
  LocalDiscoveryAiModelSearchResult,
  StoredDocumentResponse,
  StoredDocumentSearchResponse,
} from "@/app/api/discovery/local-store/types";

const mapStoredAiModel = (
  response: StoredDocumentResponse<Partial<LocalDiscoveryAiModel>>
): LocalDiscoveryAiModel => ({
  ...response._source,
  id: response._source?.id ?? response._id,
  title: response._source?.title ?? "",
  entityType: "AI_MODEL",
  publishers: response._source?.publishers ?? [],
  creators: response._source?.creators ?? [],
});

export const mapAiModelSearchResponse = (
  response: StoredDocumentSearchResponse<Partial<LocalDiscoveryAiModel>>
): LocalDiscoveryAiModelSearchResult => {
  const hits = response.hits?.hits ?? [];
  const results = hits.map(mapStoredAiModel);

  return {
    count: response.hits?.total?.value ?? results.length,
    results,
  };
};

export const mapGetAiModelDocumentResponse = (
  response: StoredDocumentResponse<Partial<LocalDiscoveryAiModel>>
): LocalDiscoveryAiModel => mapStoredAiModel(response);
