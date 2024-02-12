// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from '@jest/globals';
import axios from 'axios';
import { makePackageSearch } from '../packageSearch';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('packageSearch', () => {
  const mockApiResponse = {
    data: {
      result: {
        results: [
          {
            access_rights: 'public',
            alternate_identifier: 'alt-id',
            author: 'Author Name',
            author_email: 'author@example.com',
            conforms_to: ['Standard 1', 'Standard 2'],
            contact_email: 'contact@example.com',
            contact_name: 'Contact Name',
            contact_uri: 'http://contact.example.com',
            creator: 'Creator Name',
            creator_user_id: '43a262b8-88c7-42ca-b616-d14f24666555',
            dcat_type: 'Dataset',
            documentation: 'http://documentation.example.com',
            frequency: 'annually',
            has_version: ['v1', 'v2'],
            id: 'a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd',
            identifier: 'Dataset Identifier',
            is_referenced_by: 'Reference Document',
            is_version_of: 'Previous Version',
            isopen: false,
            landing_page: 'http://landingpage.example.com',
            language: ['EN', 'FR'],
            license_id: 'cc-zero',
            license_title: 'CC Zero',
            maintainer: 'Maintainer Name',
            maintainer_email: 'maintainer@example.com',
            metadata_created: '2024-02-09T10:27:47.585508',
            metadata_modified: '2024-02-09T10:27:58.301236',
            name: 'dummy-1',
            notes: 'This is a dummy dataset',
            num_resources: 1,
            num_tags: 2,
            owner_org: '710cdc4f-43c4-4062-a59f-a4048e4f785a',
            private: false,
            provenance: 'Provenance Information',
            publisher_email: 'publisher@example.com',
            publisher_name: 'Publisher Name',
            publisher_type: 'Publisher Type',
            publisher_uri: 'http://publisher.example.com',
            publisher_url: 'http://publisher.example.com',
            qualified_attribution: 'Qualified Attribution',
            qualified_relation: ['Relation 1', 'Relation 2'],
            relation: 'Relation Information',
            sample: 'Sample Information',
            source: 'Source Information',
            spatial_resolution_in_meters: '10',
            spatial_uri: 'http://spatial.example.com',
            state: 'active',
            temporal_resolution: 'Temporal Resolution',
            theme: ['Theme 1', 'Theme 2'],
            title: 'Dummy 1',
            type: 'dataset',
            url: 'http://example.com/dataset',
            version: '1.0',
            version_notes: 'Initial version',
            was_generated_by: 'Generation Process',
          },
        ],
        count: 1,
      },
    },
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test('maps and asserts the full server response', async () => {
    const packageSearch = makePackageSearch('https://mock-ckan-instance.com');
    const { datasets, count } = await packageSearch({});

    expect(count).toEqual(1);
    const dataset = datasets[0];

    expect(dataset.accessRights).toEqual('public');
    expect(dataset.alternateIdentifier).toEqual('alt-id');
    expect(dataset.authorEmail).toEqual('author@example.com');
    expect(dataset.conformsTo).toEqual(['Standard 1', 'Standard 2']);
    expect(dataset.creatorUserId).toEqual('43a262b8-88c7-42ca-b616-d14f24666555');
    expect(dataset.dcatType).toEqual('Dataset');
    expect(dataset.documentation).toEqual('http://documentation.example.com');
    expect(dataset.frequency).toEqual('annually');
    expect(dataset.hasVersion).toEqual(['v1', 'v2']);
    expect(dataset.id).toEqual('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');
    expect(dataset.identifier).toEqual('Dataset Identifier');
    expect(dataset.isReferencedBy).toEqual('Reference Document');
    expect(dataset.isVersionOf).toEqual('Previous Version');
    expect(dataset.isOpen).toBeFalsy();
    expect(dataset.landingPage).toEqual('http://landingpage.example.com');
    expect(dataset.language).toEqual(['EN', 'FR']);
    expect(dataset.licenseId).toEqual('cc-zero');
    expect(dataset.licenseTitle).toEqual('CC Zero');
    expect(dataset.maintainer).toEqual('Maintainer Name');
    expect(dataset.maintainerEmail).toEqual('maintainer@example.com');
    expect(dataset.metadataCreated).toEqual('2024-02-09T10:27:47.585508');
    expect(dataset.metadataModified).toEqual('2024-02-09T10:27:58.301236');
    expect(dataset.name).toEqual('dummy-1');
    expect(dataset.notes).toEqual('This is a dummy dataset');
    expect(dataset.numResources).toEqual(1);
    expect(dataset.numTags).toEqual(2);
    expect(dataset.ownerOrg).toEqual('710cdc4f-43c4-4062-a59f-a4048e4f785a');
    expect(dataset.private).toBeFalsy();
    expect(dataset.provenance).toEqual('Provenance Information');
    expect(dataset.publisherEmail).toEqual('publisher@example.com');
    expect(dataset.publisherName).toEqual('Publisher Name');
    expect(dataset.publisherType).toEqual('Publisher Type');
    expect(dataset.publisherUri).toEqual('http://publisher.example.com');
    expect(dataset.publisherUrl).toEqual('http://publisher.example.com');
    expect(dataset.qualifiedAttribution).toEqual('Qualified Attribution');
    expect(dataset.qualifiedRelation).toEqual(['Relation 1', 'Relation 2']);
    expect(dataset.relation).toEqual('Relation Information');
    expect(dataset.sample).toEqual('Sample Information');
    expect(dataset.source).toEqual('Source Information');
    expect(dataset.spatialResolutionInMeters).toEqual('10');
    expect(dataset.spatialUri).toEqual('http://spatial.example.com');
    expect(dataset.state).toEqual('active');
    expect(dataset.temporalResolution).toEqual('Temporal Resolution');
    expect(dataset.theme).toEqual(['Theme 1', 'Theme 2']);
    expect(dataset.title).toEqual('Dummy 1');
    expect(dataset.type).toEqual('dataset');
    expect(dataset.url).toEqual('http://example.com/dataset');
    expect(dataset.version).toEqual('1.0');
    expect(dataset.versionNotes).toEqual('Initial version');
    expect(dataset.wasGeneratedBy).toEqual('Generation Process');
  });

  test('applies tag filters correctly', async () => {
    const packageSearch = makePackageSearch('https://mock-ckan-instance.com');
    const searchOptions = {
      tags: ['education', 'science'],
      limit: 1,
    };

    await packageSearch(searchOptions);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('tags:(education OR science)'));
  });

  test('applies organization filters correctly', async () => {
    const packageSearch = makePackageSearch('https://mock-ckan-instance.com');
    const searchOptions = {
      orgs: ['org1', 'org2'],
      limit: 1,
    };

    await packageSearch(searchOptions);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('organization:(org1 OR org2)'));
  });

  test('combines multiple filters correctly', async () => {
    const packageSearch = makePackageSearch('https://mock-ckan-instance.com');
    const searchOptions = {
      tags: ['technology'],
      orgs: ['org1'],
      groups: ['group1'],
      resFormat: ['PDF', 'CSV'],
      limit: 1,
    };

    await packageSearch(searchOptions);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('tags:(technology)'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('organization:(org1)'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('groups:(group1)'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('res_format:(PDF OR CSV)'));
  });
});
