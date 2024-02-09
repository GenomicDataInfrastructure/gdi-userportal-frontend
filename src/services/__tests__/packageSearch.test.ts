// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from '@jest/globals';
import axios from 'axios';
import { CKAN } from '../';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('packageSearch', () => {
  const mockApiResponse = {
    data: {
      result: {
        results: [
          { id: 'dataset1', name: 'Dataset 1', title: 'First Dataset' },
          { id: 'dataset2', name: 'Dataset 2', title: 'Second Dataset' },
        ],
        count: 2,
      },
    },
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test('applies tag filters correctly', async () => {
    const ckanClient = new CKAN('https://mock-ckan-instance.com');
    const searchOptions = {
      tags: ['education', 'science'],
      limit: 2,
    };

    await ckanClient.packageSearch(searchOptions);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('tags:(education OR science)'));
  });

  test('applies organization filters correctly', async () => {
    const ckanClient = new CKAN('https://mock-ckan-instance.com');
    const searchOptions = {
      orgs: ['org1', 'org2'],
      limit: 2,
    };

    await ckanClient.packageSearch(searchOptions);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('organization:(org1 OR org2)'));
  });

  test('combines multiple filters correctly', async () => {
    const ckanClient = new CKAN('https://mock-ckan-instance.com');
    const searchOptions = {
      tags: ['technology'],
      orgs: ['org1'],
      groups: ['group1'],
      resFormat: ['PDF', 'CSV'],
      limit: 2,
    };

    await ckanClient.packageSearch(searchOptions);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('tags:(technology)'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('organization:(org1)'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('groups:(group1)'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('res_format:(PDF OR CSV)'));
  });
});
