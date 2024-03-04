// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { makeFieldDetailsGet } from '../fieldDetailsGet';
import { Field } from '../types/fieldDetails.types';

describe('makeFieldDetailsGet', () => {
  const mockFetch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches field details correctly', async () => {
    const mockResponseData = {
      result: {
        count: 5,
        results: ['LNDS', 'HealthRI', 'Data Europa', 'GDI LU', 'Data Europa'],
      },
    };

    const mockResponse = {
      json: jest.fn().mockResolvedValue(mockResponseData),
    };
    global.fetch = mockFetch.mockResolvedValue(mockResponse);

    const DMS = 'https://mock-ckan-instance.com';
    const fieldDetailsGet = makeFieldDetailsGet(DMS);
    const result = await fieldDetailsGet(Field.CATALOGUE);

    expect(mockFetch).toHaveBeenCalledWith(`${DMS}/api/3/action/catalogue_list?`);

    expect(result).toEqual({
      field: Field.CATALOGUE,
      count: 4,
      values: ['Data Europa', 'GDI LU', 'HealthRI', 'LNDS'],
    });
  });

  it('throws error on HTTP error', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    const fieldDetailsGet = makeFieldDetailsGet('https://mock-ckan-instance.com');

    await expect(fieldDetailsGet(Field.CATALOGUE)).rejects.toThrowError('HTTP error! Error: Network error');
  });
});
