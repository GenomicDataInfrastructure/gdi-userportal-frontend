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
    identifier: hit._source?.identifier,
    title: hit._source?.title ?? "",
    description: hit._source?.description,
    catalogue: hit._source?.catalogue,
    languages: hit._source?.languages,
    populationCoverage: hit._source?.populationCoverage,
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
  identifier: response._source?.identifier,
  title: response._source?.title ?? "",
  description: response._source?.description,
  catalogue: response._source?.catalogue,
  languages: response._source?.languages,
  populationCoverage: response._source?.populationCoverage,
});
