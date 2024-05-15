// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from '@/app/api/auth/auth.types';
import { encrypt } from '@/utils/encryption';
import { jest } from '@jest/globals';
import axios from 'axios';
import { makeDatasetGet } from '../datasetGet';
import { retrivedDatasetFixture } from '../fixtures/datasetFixtures';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const datasetGet = makeDatasetGet('http://localhost:5500');

describe('datasetGet', () => {
  const mockApiResponse = { data: retrivedDatasetFixture };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test('fetches and maps a dataset correctly by ID when unauthenitacted', async () => {
    const dataset = await datasetGet('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5500/api/v1/datasets/a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd', {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(dataset.id).toEqual('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');
    expect(dataset.identifier).toEqual('1');
    expect(dataset.title).toEqual('Dataset Name');
    expect(dataset.description).toEqual('description');
    expect(dataset.url).toEqual('url');

    expect(dataset.themes[0].label).toEqual('label');
    expect(dataset.themes[0].value).toEqual('value');

    expect(dataset.publisherName).toEqual('Publisher');
    expect(dataset.catalogue).toEqual('Organization');
    expect(dataset.provenance).toEqual('prov');
    expect(dataset.spatial.label).toEqual('spatial');
    expect(dataset.distributions[0].id).toEqual('dist-id');
    expect(dataset.languages[0].label).toEqual('en');
    expect(dataset.languages[0].value).toEqual('English');
    expect(dataset.keywords[0].label).toEqual('organization');
    expect(dataset.keywords[0].value).toEqual('umcg');

    expect(dataset.hasVersions.length).toEqual(1);
    expect(dataset.hasVersions[0].label).toEqual('one');

    expect(dataset.distributions.length).toEqual(1);
    const distribution = dataset.distributions[0];

    expect(distribution.id).toEqual('dist-id');
    expect(distribution.title).toEqual('dist');
    expect(distribution.description).toEqual('dist desc');
    expect(distribution.createdAt).toEqual('12-01-2023');
    expect(distribution.modifiedAt).toEqual('02-02-2024');
  });

  test('fetches and maps a dataset correctly by ID when unauthenitacted', async () => {
    const mockedSession = { access_token: encrypt('decryptedToken') } as ExtendedSession;
    const dataset = await datasetGet('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd', mockedSession);

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5500/api/v1/datasets/a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd', {
      headers: { Authorization: 'Bearer decryptedToken', 'Content-Type': 'application/json' },
    });

    expect(dataset.id).toEqual('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');
    expect(dataset.identifier).toEqual('1');
  });
});
