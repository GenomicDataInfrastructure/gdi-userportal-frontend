// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from '@jest/globals';
import axios from 'axios';
import { makeDatasetCount } from '../datasetCount';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('makeDatasetCount', () => {
  const mockApiResponse = {
    data: {
      result: {
        count: 100,
      },
    },
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test('fetches and returns the correct dataset count from the API', async () => {
    const DMS_URL = 'http://localhost:5500';
    const getDatasetCount = makeDatasetCount(DMS_URL);

    const count = await getDatasetCount();

    expect(count).toEqual(mockApiResponse.data.result.count);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${DMS_URL}/api/3/action/dataset_list?`);
  });
});
