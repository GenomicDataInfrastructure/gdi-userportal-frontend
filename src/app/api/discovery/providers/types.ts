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

export interface DiscoverySpatialCoverage {
  uri?: DiscoveryValueLabel;
  text?: string;
  geom?: string;
  bbox?: string;
  centroid?: string;
}

export interface DiscoveryDatasetBase {
  id: string;
  identifier?: string;
  title: string;
  description: string;
  languages?: DiscoveryValueLabel[];
  publishers: DiscoveryAgent[];
  themes?: DiscoveryValueLabel[];
  keywords?: string[];
  catalogue?: string;
  modifiedAt?: string;
  createdAt?: string;
  version?: string;
  hasVersions?: DiscoveryValueLabel[];
  versionNotes?: string;
  accessRights?: DiscoveryValueLabel;
  conformsTo?: DiscoveryValueLabel[];
  numberOfUniqueIndividuals?: number;
  maxTypicalAge?: number;
  minTypicalAge?: number;
  temporalCoverage?: DiscoveryTimeWindow;
  populationCoverage?: string;
  spatialCoverage?: DiscoverySpatialCoverage[];
  spatialResolutionInMeters?: number;
  retentionPeriod?: DiscoveryTimeWindow[];
  temporalResolution?: string;
  frequency?: DiscoveryValueLabel;
  hdab: DiscoveryAgent[];
  creators: DiscoveryAgent[];
  publisherType?: DiscoveryValueLabel[];
}

export interface DiscoverySearchedDataset extends DiscoveryDatasetBase {
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
  compressionFormat?: DiscoveryValueLabel;
  description: string;
  documentation?: string[];
  downloadUrl?: string;
  format?: DiscoveryValueLabel;
  languages?: DiscoveryValueLabel[];
  license?: DiscoveryValueLabel;
  conformsTo?: DiscoveryValueLabel[];
  mediaType?: string;
  modifiedAt?: string;
  packagingFormat?: DiscoveryValueLabel;
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

export interface DiscoveryRetrievedDataset extends DiscoveryDatasetBase {
  license?: string;
  ownerOrg?: string;
  contacts?: DiscoveryContactPoint[];
  datasetRelationships?: DiscoveryDatasetRelationEntry[];
  dataDictionary?: DiscoveryDatasetDictionaryEntry[];
  url?: string;
  provenance?: string;
  spatial?: DiscoveryValueLabel;
  distributions?: DiscoveryRetrievedDistribution[];
  dcatType?: DiscoveryValueLabel;
  healthTheme?: DiscoveryValueLabel[];
  healthCategory?: DiscoveryValueLabel[];
  publisherNote?: string;
  publisherCoverage?: string[];
  trustedDataHolder?: boolean; // Deprecated in HealthDCAT-AP V6; moved under Agent. Has to be removed in the future.
  legalBasis?: DiscoveryValueLabel[];
  applicableLegislation?: DiscoveryValueLabel[];
  numberOfRecords?: number;
  personalData?: DiscoveryValueLabel[];
  purpose?: DiscoveryValueLabel[];
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
