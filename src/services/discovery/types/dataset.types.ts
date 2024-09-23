// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { ValueLabel } from "./datasetSearch.types";

export interface RetrievedDataset {
  id: string;
  identifier: string;
  title: string;
  description: string;
  themes: ValueLabel[];
  publisherName: string;
  organization: RetrievedPublisher;
  createdAt: string;
  modifiedAt: string;
  url: string;
  languages: ValueLabel[];
  contacts: ContactPoint[];
  hasVersions: ValueLabel[];
  accessRights: ValueLabel;
  conformsTo: ValueLabel[];
  provenance: string;
  spatial: ValueLabel;
  distributions: RetrievedDistribution[];
  keywords: ValueLabel[];
  datasetRelationships: DatasetRelationEntry[];
  dataDictionary: DatasetDictionaryEntry[];
}

export type SearchedDataset = {
  id: string;
  identifier?: string;
  title: string;
  description?: string;
  themes?: ValueLabel[];
  keywords: ValueLabel[];
  distributions: RetrievedDistribution[];
  organization: RetrievedPublisher;
  modifiedAt: string;
  createdAt: string;
  recordsCount?: number;
};

export type DatasetEntitlement = {
  dataset?: SearchedDataset;
  start: string;
  end: string;
};

export interface RetrievedDistribution {
  id: string;
  title: string;
  description: string;
  format: ValueLabel;
  createdAt: string;
  modifiedAt: string;
  languages?: ValueLabel[];
  licenses?: ValueLabel[];
  uri: string;
}

export interface DatasetRelationEntry {
  relation: string;
  target: string;
}

export interface DatasetDictionaryEntry {
  name: string;
  type: string;
  description: string;
}

export interface ContactPoint {
  name: string;
  email: string;
}

export interface RetrievedPublisher {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  numberOfDatasets: number;
}
