// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export interface ElasticsearchSearchHit {
  _id: string;
  _source?: {
    id?: string;
    identifier?: string;
    title?: string;
    description?: string;
    catalogue?: string;
    languages?: string[];
  };
}

export interface ElasticsearchSearchResponse {
  hits?: {
    total?: {
      value?: number;
    };
    hits?: ElasticsearchSearchHit[];
  };
}

export interface ElasticsearchGetDocumentResponse {
  _id: string;
  _source?: {
    id?: string;
    identifier?: string;
    title?: string;
    description?: string;
    catalogue?: string;
    languages?: string[];
  };
}
