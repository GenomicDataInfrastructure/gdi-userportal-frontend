// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import serverConfig from '@/config/serverConfig';
import { encrypt } from '@/utils/encryption';
import { jest } from '@jest/globals';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { getServerSession } from 'next-auth';
import { POST } from '../submit/route';

jest.mock('axios');
jest.mock('next-auth/next');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('Submit an application', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns unauthorized if session is not available', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);
    const request = new Request('http://localhost', {
      method: 'POST',
    });

    const response = await POST(request, { params: { id: '5' } });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  test('successfully submit application', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });
    const request = new Request('http://localhost', {
      method: 'POST',
    });

    const response = await POST(request, { params: { id: '5' } });

    expect(response.status).toBe(200);
    expect(mockedAxios.post).toHaveBeenCalledWith(`${serverConfig.daamUrl}/api/v1/applications/5/submit`, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer decryptedToken`,
      },
      validateStatus: expect.any(Function),
    });
  });

  test('returns the proper message and status when an Axios error is thrown', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    const error = new Error() as AxiosError;
    error.isAxiosError = true;
    error.response = {
      data: 'application not in submittable state',
      status: 428,
      statusText: 'Bad Request',
      headers: {},
      config: {
        headers: {} as AxiosHeaders, // If you have specific headers, you can add them here
      },
    };
    mockedAxios.isAxiosError.mockReturnValueOnce(true);
    mockedAxios.post.mockRejectedValueOnce(error);
    const request = new Request('http://localhost', {
      method: 'POST',
    });

    const response = await POST(request, { params: { id: '9' } });

    expect(response.status).toBe(428);
    expect(await response.json()).toEqual({ error: 'application not in submittable state' });
  });

  test('returns the proper message and status if an error occurs', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    mockedAxios.post.mockRejectedValueOnce(new Error('server error'));
    const request = new Request('http://localhost', {
      method: 'POST',
    });

    const response = await POST(request, { params: { id: '9' } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'server error' });
  });

  test('returns correct validation errors', async () => {
    const encryptedToken = encrypt('decryptedToken');
    mockedGetServerSession.mockResolvedValueOnce({ access_token: encryptedToken });
    mockedAxios.post.mockResolvedValueOnce({
      status: 400,
      data: {
        detail: 'Application could not be submitted.',
        errorMessages: ['fld1 t.form.validation/required', 'fld2 t.form.validation/format_error'],
      },
    });

    const request = new Request('http://localhost', {
      method: 'POST',
    });
    const response = await POST(request, { params: { id: '10' } });

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('Field fld1 is required.');
    expect(json.error).toContain('Field fld2 had invalid format.');
  });
});
