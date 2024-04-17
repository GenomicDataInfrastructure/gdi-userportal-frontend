// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from '@jest/globals';
import axios from 'axios';
import { GET, POST } from './../route';
import { getServerSession } from 'next-auth';
import { encrypt } from '@/utils/encryption';
import serverConfig from '@/config/serverConfig';
import { ListedApplication } from '@/types/application.types';

jest.mock('axios');
jest.mock('next-auth/next');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('POST function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns unauthorized if session is not available', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost', { method: 'POST' });
    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  test('returns error if datasetIds are not provided', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken }); // Assume session is returned

    const request = new Request('http://localhost', { method: 'POST', body: JSON.stringify({}) });
    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'datasetIds are required' });
  });

  test('successfully creates an application', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { applicationId: 100 } });

    const datasetIds = ['123', '456'];
    const request = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ datasetIds }) });
    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ applicationId: 100 });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${serverConfig.daamUrl}/api/v1/applications/create`,
      { datasetIds },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer decryptedToken`,
        },
      },
    );
  });

  test('returns error if Axios request fails', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    mockedAxios.post.mockRejectedValueOnce(new Error('server error'));

    const datasetIds = ['123', '456'];
    const request = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ datasetIds }) });
    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'server error' });
  });
});

describe('GET function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns unauthorized if session is not available', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  test('returns error if Axios request fails', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    mockedAxios.get.mockRejectedValueOnce(new Error('Server error'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Server error' });
  });

  test('successfully gets applications', async () => {
    const encryptedToken = encrypt('decryptedToken');
    const mockApiResponse = {
      data: [
        {
          id: 1,
          title: 'Test application 1',
          stateChangedAt: '',
          currentState: 'Submited',
        },
        {
          id: 2,
          title: 'Test application 2',
          stateChangedAt: '',
          currentState: 'Approved',
        },
      ] as ListedApplication[],
    };

    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const response = await GET();
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson.length).toEqual(2);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${serverConfig.daamUrl}/api/v1/applications`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer decryptedToken`,
      },
    });
  });
});
