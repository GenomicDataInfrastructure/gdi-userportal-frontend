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
  legalBasis?: Array<{ value: string; label: string }>;
  applicableLegislation?: Array<{ value: string; label: string }>;
  distributions?: LocalDiscoveryDistribution[];
  contacts?: LocalContactPoint[];
  datasetRelationships?: LocalDatasetRelation[];
  publishers: LocalAgent[];
  hdab: LocalAgent[];
  creators: LocalAgent[];
  publisherType?: Array<{ value: string; label: string }>;
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

export interface LocalDiscoverySearchOptions {
  query?: string;
  sort?: string;
  start?: number;
  rows?: number;
}

export interface LocalDiscoverySearchResult {
  count: number;
  results: LocalDiscoveryDataset[];
}

export interface LocalDiscoveryStore {
  readonly key: string;
  ensureInitialized: () => Promise<void>;
  clearDatasets: () => Promise<void>;
  searchDatasets: (
    options: LocalDiscoverySearchOptions
  ) => Promise<LocalDiscoverySearchResult>;
  retrieveDataset: (id: string) => Promise<LocalDiscoveryDataset | null>;
  upsertDatasets: (datasets: LocalDiscoveryDataset[]) => Promise<void>;
}
