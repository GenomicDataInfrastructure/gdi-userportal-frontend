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
  publishers: Agent[];
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
  publishers: Agent[];
  modifiedAt: string;
  createdAt: string;
  recordsCount?: number;
  distributionsCount: number;
};

export type DatasetEntitlement = {
  dataset: SearchedDataset;
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
  downloadUrl?: string;
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

export interface Agent {
  name: string;
  email: string;
  url: string;
  type: string;
  identifier: string;
}

export enum FilterValueType {
  THEME = "theme",
  PUBLISHER = "publisher_name",
}
