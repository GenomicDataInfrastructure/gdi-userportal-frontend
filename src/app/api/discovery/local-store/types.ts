// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export interface SpatialCoverage {
  uri?: string;
  text?: string;
  geom?: string;
  bbox?: string;
  centroid?: string;
}

export interface LocalAgent {
  name: string;
  email?: string;
  url?: string;
  uri?: string;
  homepage?: string;
  type?: { value: string; label: string };
  identifier?: string;
  actedOnBehalfOf?: LocalAgent[];
}

export interface LocalDiscoveryDistribution {
  id: string;
  title: string;
  format?: { value: string; label: string };
  mediaType?: { value: string; label: string };
  license?: { value: string; label: string };
  conformsTo?: Array<{ value: string; label: string }>;
  byteSize?: number;
  accessUrl?: string;
  downloadUrl?: string;
}

export interface LocalContactPoint {
  name: string;
  email: string;
  uri?: string;
  url?: string;
  identifier?: string;
}

export interface LocalDatasetRelation {
  relation: string;
  target: string;
}

export interface LocalDiscoveryDataset {
  id: string;
  identifier?: string;
  title: string;
  description?: string;
  catalogue?: string;
  languages?: string[];
  createdAt?: string;
  modifiedAt?: string;
  version?: string;
  hasVersions?: Array<{ value: string; label: string }>;
  versionNotes?: string[];
  numberOfRecords?: number;
  numberOfUniqueIndividuals?: number;
  maxTypicalAge?: number;
  minTypicalAge?: number;
  populationCoverage?: string;
  spatialCoverage?: SpatialCoverage[];
  spatialResolutionInMeters?: number[];
  temporalCoverage?: { start?: string; end?: string };
  retentionPeriod?: Array<{ start?: string; end?: string }>;
  temporalResolution?: string;
  frequency?: { value: string; label: string };
  themes?: Array<{ value: string; label: string }>;
  keywords?: string[];
  healthTheme?: Array<{ value: string; label: string }>;
  healthCategory?: Array<{ value: string; label: string }>;
  dcatType?: Array<{ value: string; label: string }>;
  accessRights?: { value: string; label: string };
  conformsTo?: Array<{ value: string; label: string }>;
  legalBasis?: Array<{ value: string; label: string }>;
  applicableLegislation?: Array<{ value: string; label: string }>;
  distributions?: LocalDiscoveryDistribution[];
  distributionsCount?: number;
  contacts?: LocalContactPoint[];
  datasetRelationships?: LocalDatasetRelation[];
  publishers: LocalAgent[];
  hdab: LocalAgent[];
  creators: LocalAgent[];
  publisherType?: Array<{ value: string; label: string }>;
  personalData?: Array<{ value: string; label: string }>;
}

export interface StoredDocumentHit<TDocument> {
  _id: string;
  _source?: TDocument;
}

export interface StoredDocumentSearchResponse<TDocument> {
  hits?: {
    total?: {
      value?: number;
    };
    hits?: StoredDocumentHit<TDocument>[];
  };
}

export interface StoredDocumentResponse<TDocument> {
  _id: string;
  _source?: TDocument;
}

export type LocalDiscoverySearchFacetType =
  | "DROPDOWN"
  | "FREE_TEXT"
  | "ENTRIES"
  | "DATETIME"
  | "NUMBER";

export type LocalDiscoveryQueryOperator = "OR" | "AND";
export type LocalDiscoveryOperator = "=" | "<" | ">" | "!" | ">=" | "<=";
export type LocalDiscoverySearchFacetEntry = { key: string; value: string };

export interface LocalDiscoverySearchFacet {
  type: LocalDiscoverySearchFacetType;
  key?: string;
  value?: string;
  operator?: LocalDiscoveryOperator;
  entries?: LocalDiscoverySearchFacetEntry[];
}

export interface LocalDiscoverySearchOptions {
  query?: string;
  facets?: LocalDiscoverySearchFacet[];
  sort?: string;
  start?: number;
  rows?: number;
  operator?: LocalDiscoveryQueryOperator;
}

export interface LocalDiscoverySearchResult {
  count: number;
  results: LocalDiscoveryDataset[];
}

export interface LocalDiscoveryValueLabel {
  value: string;
  label: string;
  count?: number;
}

export interface LocalDiscoveryFilterRange {
  min?: string;
  max?: string;
}

export interface LocalDiscoveryFilterEntry {
  key: string;
  label: string;
}

export interface LocalDiscoveryFilter {
  group?: string;
  type: LocalDiscoverySearchFacetType;
  key: string;
  label: string;
  values?: LocalDiscoveryValueLabel[];
  range?: LocalDiscoveryFilterRange;
  operators?: LocalDiscoveryOperator[];
  entries?: LocalDiscoveryFilterEntry[];
}

export interface LocalDiscoveryStore {
  readonly key: string;
  ensureInitialized: () => Promise<void>;
  clearDatasets: () => Promise<void>;
  retrieveFilterValues: (key: string) => Promise<LocalDiscoveryValueLabel[]>;
  searchDatasets: (
    options: LocalDiscoverySearchOptions
  ) => Promise<LocalDiscoverySearchResult>;
  retrieveDataset: (id: string) => Promise<LocalDiscoveryDataset | null>;
  upsertDatasets: (datasets: LocalDiscoveryDataset[]) => Promise<void>;
}
