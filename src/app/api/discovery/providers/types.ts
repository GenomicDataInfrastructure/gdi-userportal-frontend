// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Domain-level query and response models for discovery operations.
 * These intentionally sit between UI-facing server functions and
 * provider-specific payloads.
 */
export interface DiscoverySearchFacetEntry {
  key: string;
  value: string;
}

export type DiscoveryFilterType =
  | "DROPDOWN"
  | "FREE_TEXT"
  | "ENTRIES"
  | "DATETIME"
  | "NUMBER";

export type DiscoveryOperator = "=" | "<" | ">" | "!" | ">=" | "<=";
export type DiscoveryQueryOperator = "OR" | "AND";

export interface DiscoverySearchFacet {
  source: string;
  type: DiscoveryFilterType;
  key?: string;
  value?: string;
  operator?: DiscoveryOperator;
  entries?: DiscoverySearchFacetEntry[];
}

export interface DiscoveryDatasetSearchQuery {
  query?: string;
  facets?: DiscoverySearchFacet[];
  sort?: string;
  rows?: number;
  start?: number;
  operator?: DiscoveryQueryOperator;
  includeBeacon?: boolean;
}

export interface DiscoveryValueLabel {
  value: string;
  label: string;
  count?: number;
}

export interface DiscoveryAgent {
  name: string;
  email?: string;
  url?: string;
  uri?: string;
  homepage?: string;
  type?: DiscoveryValueLabel;
  identifier?: string;
  actedOnBehalfOf?: DiscoveryAgent[];
}

export interface DiscoveryTimeWindow {
  start?: string;
  end?: string;
}

export interface DiscoverySearchedDataset {
  id: string;
  identifier?: string;
  title: string;
  description: string;
  languages?: DiscoveryValueLabel[];
  publishers?: DiscoveryAgent[];
  themes?: DiscoveryValueLabel[];
  keywords?: string[];
  catalogue?: string;
  modifiedAt?: string;
  createdAt?: string;
  accessRights?: DiscoveryValueLabel;
  conformsTo?: DiscoveryValueLabel[];
  numberOfUniqueIndividuals?: number;
  temporalCoverage?: DiscoveryTimeWindow;
  recordsCount?: number;
  distributionsCount?: number;
}

export interface DiscoveryDatasetsSearchResponse {
  count?: number;
  results?: DiscoverySearchedDataset[];
  beaconError?: string;
}

export interface DiscoveryContactPoint {
  name: string;
  email: string;
  uri?: string;
  url?: string;
  identifier?: string;
}

export interface DiscoveryDatasetRelationEntry {
  relation: string;
  target: string;
}

export interface DiscoveryDatasetDictionaryEntry {
  name: string;
  type: string;
  description: string;
}

export interface DiscoveryRetrievedDistribution {
  accessUrl?: string;
  applicableLegislation?: DiscoveryValueLabel[];
  byteSize?: number;
  checksum?: string;
  checksumAlgorithm?: DiscoveryValueLabel;
  compressionFormat?: string;
  description: string;
  documentation?: string[];
  downloadUrl?: string;
  format?: DiscoveryValueLabel;
  languages?: DiscoveryValueLabel[];
  license?: DiscoveryValueLabel;
  conformsTo?: DiscoveryValueLabel[];
  mediaType?: string;
  modifiedAt?: string;
  packagingFormat?: string;
  createdAt?: string;
  retentionPeriod?: DiscoveryTimeWindow[];
  rights?: string;
  status?: DiscoveryValueLabel;
  temporalResolution?: string;
  title: string;
  availability?: string;
  id: string;
  spatialResolutionInMeters?: number;
  uri?: string;
}

export interface DiscoveryRetrievedDataset {
  id: string;
  identifier?: string;
  title: string;
  description: string;
  version?: string;
  license?: string;
  ownerOrg?: string;
  themes?: DiscoveryValueLabel[];
  contacts?: DiscoveryContactPoint[];
  datasetRelationships?: DiscoveryDatasetRelationEntry[];
  dataDictionary?: DiscoveryDatasetDictionaryEntry[];
  catalogue?: string;
  createdAt?: string;
  modifiedAt?: string;
  url?: string;
  languages?: DiscoveryValueLabel[];
  creators?: DiscoveryAgent[];
  publishers?: DiscoveryAgent[];
  hasVersions?: DiscoveryValueLabel[];
  accessRights?: DiscoveryValueLabel;
  conformsTo?: DiscoveryValueLabel[];
  keywords?: string[];
  provenance?: string;
  spatial?: DiscoveryValueLabel;
  distributions?: DiscoveryRetrievedDistribution[];
  dcatType?: DiscoveryValueLabel;
  publisherNote?: string;
  publisherCoverage?: string[];
  publisherType?: DiscoveryValueLabel[];
  trustedDataHolder?: boolean;
  hdab?: DiscoveryAgent[];
  temporalCoverage?: DiscoveryTimeWindow;
  numberOfRecords?: number;
  numberOfUniqueIndividuals?: number;
}

export interface DiscoveryFilterRange {
  min?: string;
  max?: string;
}

export interface DiscoveryFilterEntry {
  key: string;
  label: string;
}

export interface DiscoveryFilter {
  source: string;
  group?: string;
  type: DiscoveryFilterType;
  key: string;
  label: string;
  values?: DiscoveryValueLabel[];
  range?: DiscoveryFilterRange;
  operators?: DiscoveryOperator[];
  entries?: DiscoveryFilterEntry[];
}

export interface DiscoveryGVariantSearchQueryParams {
  referenceName?: string;
  start?: number[];
  end?: number[] | null;
  referenceBases?: string;
  alternateBases?: string;
  assemblyId?: string;
  sex?: string;
  countryOfBirth?: string;
}

export interface DiscoveryGVariantSearchQuery {
  params: DiscoveryGVariantSearchQueryParams;
}

export interface DiscoveryGVariantSearchResult {
  beacon?: string;
  dataset?: string;
  datasetId?: string;
  population?: string;
  sex?: string;
  countryOfBirth?: string;
  alleleCount?: number;
  alleleNumber?: number;
  alleleCountHomozygous?: number;
  alleleCountHeterozygous?: number;
  alleleCountHemizygous?: number;
  alleleFrequency?: number;
}

export interface DiscoveryProviderCapabilities {
  supportsBeaconEnrichment: boolean;
  supportsGVariants: boolean;
  supportsFilterEntries: boolean;
}

export interface DiscoveryProvider {
  readonly key: string;
  readonly capabilities: DiscoveryProviderCapabilities;
  retrieveFilters: (
    headers: Record<string, string>
  ) => Promise<DiscoveryFilter[]>;
  retrieveFilterValues: (
    key: string,
    headers: Record<string, string>
  ) => Promise<DiscoveryValueLabel[]>;
  searchDatasets: (
    options: DiscoveryDatasetSearchQuery,
    headers: Record<string, string>
  ) => Promise<DiscoveryDatasetsSearchResponse>;
  retrieveDataset: (id: string) => Promise<DiscoveryRetrievedDataset>;
  retrieveDatasetInFormat: (
    id: string,
    format: "rdf" | "ttl" | "jsonld",
    headers: Record<string, string>
  ) => Promise<Blob>;
  searchGVariants: (
    options: DiscoveryGVariantSearchQuery
  ) => Promise<DiscoveryGVariantSearchResult[]>;
}
