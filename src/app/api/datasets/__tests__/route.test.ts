// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from '@jest/globals';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { encrypt } from '@/utils/encryption';
import serverConfig from '@/config/serverConfig';
import { POST } from '../route';

jest.mock('axios');
jest.mock('next-auth/next');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const options = {
  facets: [],
  query: undefined,
  rows: 10,
  sort: undefined,
  start: 0,
};

describe('POST function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { count: 100 } });
  });

  test('returns datasets response for authenitacted user', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });

    const request = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ options }) });
    await POST(request);

    expect(mockedAxios.post).toHaveBeenCalledWith(`${serverConfig.discoveryUrl}/api/v1/datasets/search`, options, {
      headers: { Authorization: 'Bearer decryptedToken', 'Content-Type': 'application/json' },
    });
  });

  test('returns datasets response for unauthenitacted user', async () => {
    mockedGetServerSession.mockResolvedValueOnce(undefined);
    const request = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ options }) });
    await POST(request);

    expect(mockedAxios.post).toHaveBeenCalledWith(`${serverConfig.discoveryUrl}/api/v1/datasets/search`, options, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('returns error if Axios request fails', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    mockedAxios.post.mockRejectedValueOnce(new Error('Axios error'));

    const request = new Request('http://localhost', { method: 'POST' });
    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Unexpected error occurred' });
  });
});
