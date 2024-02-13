// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from '@jest/globals';
import axios from 'axios';
import { makePackageShow } from '../packageShow'; // Adjust import path as needed

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('packageShow', () => {
  const mockApiResponse = {
    data: {
      result: {
        id: 'a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd',
        title: 'Test Dataset',
      },
    },
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test('fetches and maps a dataset correctly by ID', async () => {
    const packageShow = makePackageShow('https://mock-ckan-instance.com');
    const dataset = await packageShow('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://mock-ckan-instance.com/api/3/action/package_show?id=a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd',
    );
    expect(dataset.id).toEqual('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');
    expect(dataset.title).toEqual('Test Dataset');
  });
});
