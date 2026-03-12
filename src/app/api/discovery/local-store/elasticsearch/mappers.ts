// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchResult,
  StoredDocumentResponse,
} from "@/app/api/discovery/local-store/types";
import {
  SearchBackendDocumentResponse,
  SearchBackendSearchResponse,
} from "@/app/api/discovery/local-store/elasticsearch/types";

const mapStoredDocument = (
  response: StoredDocumentResponse<Partial<LocalDiscoveryDataset>>
): LocalDiscoveryDataset => ({
  ...response._source,
  id: response._source?.id ?? response._id,
  title: response._source?.title ?? "",
});

export const mapSearchResponse = (
  response: SearchBackendSearchResponse
): LocalDiscoverySearchResult => {
  const hits = response.hits?.hits ?? [];
  const results = hits.map(mapStoredDocument);

  return {
    count: response.hits?.total?.value ?? results.length,
    results,
  };
};

export const mapGetDocumentResponse = (
  response: SearchBackendDocumentResponse
): LocalDiscoveryDataset => mapStoredDocument(response);
