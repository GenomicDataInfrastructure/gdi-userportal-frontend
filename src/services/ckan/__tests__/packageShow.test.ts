// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from '@jest/globals';
import axios from 'axios';
import { packageFixture } from '../fixtures/packageFixtures';
import { makePackageShow } from '../packageShow';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('packageShow', () => {
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
    const packageShow = makePackageShow('http://localhost:5500');
    const dataset = await packageShow('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:5500/api/3/action/package_show?id=a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd',
    );
    expect(dataset.id).toEqual('a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd');
    expect(dataset.title).toEqual('Dummy 1');
  });
});
