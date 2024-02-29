// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import formatDatasetLanguage from '../formatDatasetLanguage';

jest.mock('iso-639-3/iso6393', () => ({
  iso6393: [{ name: 'English', type: 'living', scope: 'individual', iso6393: 'eng' }],
}));

describe('formatDatasetLanguage', () => {
  it('should return the correct language name for a valid ISO 639-3 code', () => {
    const code = 'eng';
    const result = formatDatasetLanguage(`http://example.com/language/${code}`);
    expect(result).toEqual('English');
  });

  it('should return undefined for an invalid ISO 639-3 code', () => {
    const invalidCode = 'xyz';
    const result = formatDatasetLanguage(`http://example.com/language/${invalidCode}`);
    expect(result).toBeUndefined();
  });

  it('should handle cases where the input is not a URL', () => {
    const code = 'eng';
    const result = formatDatasetLanguage(code);
    expect(result).toEqual('English');
  });

  it('should return undefined if the language code is missing', () => {
    const result = formatDatasetLanguage('http://example.com/language/');
    expect(result).toBeUndefined();
  });

  it('should be case insensitive', () => {
    const code = 'Eng'; // Mixed case
    const result = formatDatasetLanguage(`http://example.com/language/${code}`);
    expect(result).toEqual('English');
  });
});
