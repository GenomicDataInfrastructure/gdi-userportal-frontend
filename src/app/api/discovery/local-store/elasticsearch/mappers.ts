// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchResult,
} from "@/app/api/discovery/local-store/types";
import {
  ElasticsearchGetDocumentResponse,
  ElasticsearchSearchResponse,
} from "@/app/api/discovery/local-store/elasticsearch/types";

export const mapSearchResponse = (
  response: ElasticsearchSearchResponse
): LocalDiscoverySearchResult => {
  const hits = response.hits?.hits ?? [];
  const results: LocalDiscoveryDataset[] = hits.map((hit) => ({
    id: hit._source?.id ?? hit._id,
    title: hit._source?.title ?? "",
    description: hit._source?.description,
  }));

  return {
    count: response.hits?.total?.value ?? results.length,
    results,
  };
};

export const mapGetDocumentResponse = (
  response: ElasticsearchGetDocumentResponse
): LocalDiscoveryDataset => ({
  id: response._source?.id ?? response._id,
  title: response._source?.title ?? "",
  description: response._source?.description,
});
