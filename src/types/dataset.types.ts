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

export interface Dataset {
  author: DatasetAuthor;
  contact: DatasetContact;
  creator: DatasetCreator;
  version: DatasetVersion;
  license: DatasetLicense;
  maintainer: DatasetMaintainer;
  publisher: DatasetPublisher;
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
  language: string[];
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
}
