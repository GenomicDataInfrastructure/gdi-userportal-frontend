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
    createdAt: hit._source?.createdAt,
    modifiedAt: hit._source?.modifiedAt,
    version: hit._source?.version,
    hasVersions: hit._source?.hasVersions,
    versionNotes: hit._source?.versionNotes,
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
  createdAt: response._source?.createdAt,
  modifiedAt: response._source?.modifiedAt,
  version: response._source?.version,
  hasVersions: response._source?.hasVersions,
  versionNotes: response._source?.versionNotes,
  populationCoverage: response._source?.populationCoverage,
});
