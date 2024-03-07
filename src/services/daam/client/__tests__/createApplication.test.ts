// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from '@jest/globals';
import axios from 'axios';
import { createApplication } from '../createApplication';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('createApplication', () => {
  const datasetIds = ['123', '456'];
  const mockApiResponse = {};

  beforeEach(() => {
    mockedAxios.post.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.post.mockClear();
  });

  test('sends a POST request with the correct parameters to create an application', async () => {
    await createApplication(datasetIds);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/applications',
      { datasetIds: datasetIds },
      { headers: { 'Content-Type': 'application/json' } },
    );
  });
});
