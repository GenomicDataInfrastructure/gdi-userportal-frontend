// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryDataset,
  StoredDocumentResponse,
  StoredDocumentSearchResponse,
} from "@/app/api/discovery/local-store/types";

export type SearchBackendSearchResponse = StoredDocumentSearchResponse<
  Partial<LocalDiscoveryDataset>
>;

export type SearchBackendDocumentResponse = StoredDocumentResponse<
  Partial<LocalDiscoveryDataset>
>;

export interface SearchBackendTermsAggregationBucket {
  key: string;
  doc_count: number;
}

export interface SearchBackendTermsAggregationResponse {
  aggregations?: {
    values?: {
      buckets?: SearchBackendTermsAggregationBucket[];
    };
  };
}
