// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

interface DatasetContact {
  contactEmail: string;
  contactName: string;
  contactUri: string;
}

interface DatasetMaintainer {
  name: string;
  email: string;
}

interface DatasetPublisher {
  email: string;
  name: string;
  type: string;
  url: string;
}

interface DatasetCreator {
  name: string;
  userId: string;
}

interface DatasetAuthor {
  name: string;
  email: string;
}

interface DatasetLicense {
  id: string;
  title: string;
}

interface DatasetVersion {
  hasVersion: string[];
  isVersionOf: string;
  version: string;
  notes: string;
}

interface DatasetKeywords {
  id: string;
  displayName: string;
  name: string;
}

export interface Dataset {
  author: DatasetAuthor;
  contact: DatasetContact;
  creator: DatasetCreator;
  version: DatasetVersion;
  license: DatasetLicense;
  maintainer: DatasetMaintainer;
  publisher: DatasetPublisher;
  keywords: DatasetKeywords[];
  accessRights: string;
  alternateIdentifier: string;
  conformsTo: string[];
  dcatType: string;
  documentation: string;
  frequency: string;
  id: string;
  identifier: string;
  isReferencedBy: string;
  isOpen: boolean;
  landingPage: string;
  languages: string[];
  metadataCreated: string;
  metadataModified: string;
  name: string;
  notes: string;
  numResources: number;
  numTags: number;
  ownerOrg: string;
  private: boolean;
  provenance: string;
  qualifiedAttribution: string;
  qualifiedRelation: string;
  relation: string;
  sample: string;
  source: string;
  spatialResolutionInMeters: string;
  spatialUri: string;
  state: string;
  temporalResolution: string;
  theme: string[];
  title: string;
  type: string;
  url: string;
  wasGeneratedBy: string;
  distributions: DatasetDistribution[];
}

export interface DatasetDistribution {
  accessServices: string;
  accessUrl: string;
  availability: string;
  cacheLastUpdated: null | string;
  cacheUrl: null | string;
  compressFormat: string;
  conformsTo: string;
  created: string;
  description: string;
  documentation: string;
  downloadUrl: string;
  format: string;
  hasPolicy: string;
  hash: string;
  hashAlgorithm: string;
  id: string;
  issued: string;
  language: string;
  lastModified: null | string;
  metadataModified: string;
  mimetype: null | string;
  mimetypeInner: null | string;
  modified: string;
  name: string;
  packageFormat: string;
  packageId: string;
  position: number;
  resourceType: null | string;
  rights: string;
  spatialResolutionInMeters: string;
  state: string;
  status: string;
  temporalResolution: string;
  url: string;
  urlType: string | null;
}
