// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { Dataset } from './../../types/dataset.types';
import { CKANPackage } from './types/package.types';

export const mapCKANPackageToDataset = (ckanPackage: CKANPackage): Dataset => {
  return {
    accessRights: ckanPackage.access_rights,
    alternateIdentifier: ckanPackage.alternate_identifier,
    author: {
      name: ckanPackage.author,
      email: ckanPackage.author_email,
    },
    contact: {
      contactEmail: ckanPackage.contact_email,
      contactName: ckanPackage.contact_name,
      contactUri: ckanPackage.contact_uri,
    },
    creator: {
      name: ckanPackage.creator,
      userId: ckanPackage.creator_user_id,
    },
    version: {
      hasVersion: ckanPackage.has_version,
      isVersionOf: ckanPackage.is_version_of,
      version: ckanPackage.version,
      notes: ckanPackage.version_notes,
    },
    license: {
      id: ckanPackage.license_id,
      title: ckanPackage.license_title,
    },
    maintainer: {
      name: ckanPackage.maintainer,
      email: ckanPackage.maintainer_email,
    },
    publisher: {
      email: ckanPackage.publisher_email,
      name: ckanPackage.publisher_name,
      type: ckanPackage.publisher_type,
      url: ckanPackage.publisher_url,
    },
    conformsTo: ckanPackage.conforms_to,
    dcatType: ckanPackage.dcat_type,
    documentation: ckanPackage.documentation,
    frequency: ckanPackage.frequency,
    id: ckanPackage.id,
    identifier: ckanPackage.identifier,
    isReferencedBy: ckanPackage.is_referenced_by,
    isOpen: ckanPackage.isopen,
    landingPage: ckanPackage.landing_page,
    language: ckanPackage.language,
    metadataCreated: ckanPackage.metadata_created,
    metadataModified: ckanPackage.metadata_modified,
    name: ckanPackage.name,
    notes: ckanPackage.notes,
    numResources: ckanPackage.num_resources,
    numTags: ckanPackage.num_tags,
    ownerOrg: ckanPackage.owner_org,
    private: ckanPackage.private,
    provenance: ckanPackage.provenance,
    qualifiedAttribution: ckanPackage.qualified_attribution,
    qualifiedRelation: ckanPackage.qualified_relation,
    relation: ckanPackage.relation,
    sample: ckanPackage.sample,
    source: ckanPackage.source,
    spatialResolutionInMeters: ckanPackage.spatial_resolution_in_meters,
    spatialUri: ckanPackage.spatial_uri,
    state: ckanPackage.state,
    temporalResolution: ckanPackage.temporal_resolution,
    theme: ckanPackage.theme,
    title: ckanPackage.title,
    type: ckanPackage.type,
    url: ckanPackage.url,
    wasGeneratedBy: ckanPackage.was_generated_by,
  };
};

export const constructCkanActionUrl = (DMS: string, action: string, queryParams: string = ''): string => {
  return `${DMS}/api/3/action/${action}?${queryParams}`;
};
