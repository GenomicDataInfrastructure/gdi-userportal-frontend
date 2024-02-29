// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
interface CKANOrganization {
  id: string;
  name: string;
  title: string;
  type: string;
  description: string;
  image_url: string;
  created: string;
  is_organization: boolean;
  approval_status: string;
  state: string;
}

interface CKANTag {
  id: string;
  name: string;
  display_name: string;
  state: string;
  vocabulary_id: string;
}

interface CKANResource {
  access_services: string;
  access_url: string;
  availability: string;
  cache_last_updated: null | string;
  cache_url: null | string;
  compress_format: string;
  conforms_to: string;
  created: string;
  description: string;
  documentation: string;
  download_url: string;
  format: string;
  has_policy: string;
  hash: string;
  hash_algorithm: string;
  id: string;
  language: string;
  last_modified: null | string;
  metadata_modified: string;
  mimetype: null | string;
  mimetype_inner: null | string;
  name: string;
  package_format: string;
  package_id: string;
  position: number;
  resource_type: null | string;
  rights: string;
  spatial_resolution_in_meters: string;
  state: string;
  status: string;
  temporal_resolution: string;
  url: string;
  url_type: string;
  modified: string;
  issued: string;
}

export interface CKANPackage {
  access_rights: string;
  alternate_identifier: string;
  author: string;
  author_email: string;
  conforms_to: string[];
  contact_email: string;
  contact_name: string;
  contact_uri: string;
  creator: string;
  creator_user_id: string;
  dcat_type: string;
  documentation: string;
  frequency: string;
  has_version: string[];
  id: string;
  identifier: string;
  is_referenced_by: string;
  is_version_of: string;
  isopen: boolean;
  landing_page: string;
  language: string[];
  license_id: string;
  license_title: string;
  maintainer: string;
  maintainer_email: string;
  metadata_created: string;
  metadata_modified: string;
  name: string;
  notes: string;
  num_resources: number;
  num_tags: number;
  organization: CKANOrganization;
  owner_org: string;
  private: boolean;
  provenance: string;
  publisher_email: string;
  publisher_name: string;
  publisher_type: string;
  publisher_uri: string;
  publisher_url: string;
  qualified_attribution: string;
  qualified_relation: string;
  relation: string;
  sample: string;
  source: string;
  spatial_resolution_in_meters: string;
  spatial_uri: string;
  state: string;
  temporal_resolution: string;
  theme: string[];
  title: string;
  type: string;
  url: string;
  version: string;
  version_notes: string;
  was_generated_by: string;
  resources: CKANResource[];
  tags: CKANTag[];
}
