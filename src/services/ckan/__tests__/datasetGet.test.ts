// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from '@jest/globals';
import axios from 'axios';
import { makeDatasetGet } from '../datasetGet';
import { packageFixture } from '../fixtures/packageFixtures';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('datasetGet', () => {
  const mockApiResponse = {
    data: {
      result: packageFixture,
    },
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test('fetches and maps a dataset correctly by ID', async () => {
    const datasetGet = makeDatasetGet('http://localhost:5500');
    const dataset = await datasetGet('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:5500/api/3/action/package_show?id=a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd',
    );
    expect(dataset.id).toEqual('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');
    expect(dataset.title).toEqual('Dummy 1');
    expect(dataset.accessRights).toEqual('public');
    expect(dataset.alternateIdentifier).toEqual('alt-id');
    expect(dataset.conformsTo).toEqual(['Standard 1', 'Standard 2']);
    expect(dataset.dcatType).toEqual('Dataset');
    expect(dataset.documentation).toEqual('http://documentation.example.com');
    expect(dataset.frequency).toEqual('annually');
    expect(dataset.id).toEqual('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');
    expect(dataset.identifier).toEqual('Dataset Identifier');
    expect(dataset.isReferencedBy).toEqual('Reference Document');
    expect(dataset.isOpen).toBeFalsy();
    expect(dataset.landingPage).toEqual('http://landingpage.example.com');
    expect(dataset.language).toEqual(['EN', 'FR']);
    expect(dataset.metadataCreated).toEqual('2024-02-09T10:27:47.585508');
    expect(dataset.metadataModified).toEqual('2024-02-09T10:27:58.301236');
    expect(dataset.name).toEqual('dummy-1');
    expect(dataset.notes).toEqual('This is a dummy dataset');
    expect(dataset.numResources).toEqual(1);
    expect(dataset.numTags).toEqual(2);
    expect(dataset.ownerOrg).toEqual('710cdc4f-43c4-4062-a59f-a4048e4f785a');
    expect(dataset.private).toBeFalsy();
    expect(dataset.provenance).toEqual('Provenance Information');
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
    expect(dataset.wasGeneratedBy).toEqual('Generation Process');

    expect(dataset.author.name).toEqual('Author Name');
    expect(dataset.author.email).toEqual('author@example.com');
    expect(dataset.contact.contactEmail).toEqual('contact@example.com');
    expect(dataset.contact.contactName).toEqual('Contact Name');
    expect(dataset.contact.contactUri).toEqual('http://contact.example.com');
    expect(dataset.creator.name).toEqual('Creator Name');
    expect(dataset.creator.userId).toEqual('43a262b8-88c7-42ca-b616-d14f24666555');
    expect(dataset.version.hasVersion).toEqual(['v1', 'v2']);
    expect(dataset.version.isVersionOf).toEqual('Previous Version');
    expect(dataset.version.version).toEqual('1.0');
    expect(dataset.version.notes).toEqual('Initial version');
    expect(dataset.license.id).toEqual('cc-zero');
    expect(dataset.license.title).toEqual('CC Zero');
    expect(dataset.maintainer.name).toEqual('Maintainer Name');
    expect(dataset.maintainer.email).toEqual('maintainer@example.com');
    expect(dataset.publisher.email).toEqual('publisher@example.com');
    expect(dataset.publisher.name).toEqual('Publisher Name');
    expect(dataset.publisher.type).toEqual('Publisher Type');
    expect(dataset.publisher.url).toEqual('http://publisher.example.com');

    expect(dataset.keywords.length).toEqual(1);
    expect(dataset.keywords[0].id).toEqual('keyword-1');
    expect(dataset.keywords[0].name).toEqual('Keyword 1');
    expect(dataset.keywords[0].displayName).toEqual('Keyword 1');
  });
});
