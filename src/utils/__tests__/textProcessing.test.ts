// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { parseFilterValuesSingleQueryString, truncateDescription } from '../textProcessing';

describe('Truncate description', () => {
  it('should truncate description to 30 words for screen of 700px (small)', () => {
    const description =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research. The BMIA XNAT will be used as main image data storage platform for centralized storage. As first usecase, breast cancer was identified, for which the first datasets will be collected from the University of Barcelona. The data will first be available to partners within the consortium, but will potentially be publicly released';
    const screenWidth = 700;
    const expected =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research. The BMIA XNAT will be used as main image...';

    const truncatedDesc = truncateDescription(description, screenWidth);

    expect(truncatedDesc).toEqual(expected);
  });

  it('should not truncate description of 30 words for screen of 700px (small)', () => {
    const description =
      'International Carotid Stenting Study (ICSS or ICS). To compare the risks, benefits and cost effectiveness of a treatment policy of referral for carotid stenting compared with referral for carotid surgery.';
    const screenWidth = 700;
    const expected =
      'International Carotid Stenting Study (ICSS or ICS). To compare the risks, benefits and cost effectiveness of a treatment policy of referral for carotid stenting compared with referral for carotid surgery.';

    const truncatedDesc = truncateDescription(description, screenWidth);

    expect(truncatedDesc).toEqual(expected);
  });

  it('should truncate description to 40 words for screen of 1000px (medium)', () => {
    const description =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research. The BMIA XNAT will be used as main image data storage platform for centralized storage. As first usecase, breast cancer was identified, for which the first datasets will be collected from the University of Barcelona. The data will first be available to partners within the consortium, but will potentially be publicly released';
    const screenWidth = 1000;
    const expected =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research. The BMIA XNAT will be used as main image data storage platform for centralized storage. As first usecase, breast...';

    const truncatedDesc = truncateDescription(description, screenWidth);

    expect(truncatedDesc).toEqual(expected);
  });

  it('should get rid of potential punctuation in cut-off position and replace it with ellipsis, while keeping all other punctuations', () => {
    const description =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research? The BMIA XNAT will be used as main image! data storage platform for centralized storage. As first usecase, breast cancer was identified, for which the first datasets will be collected from the University of Barcelona. The data will first be available to partners within the consortium, but will potentially be publicly released';
    const screenWidth = 700;
    const expected =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research? The BMIA XNAT will be used as main image...';

    const truncatedDesc = truncateDescription(description, screenWidth);

    expect(truncatedDesc).toEqual(expected);
  });
});

describe('Parse filter values from a single query string', () => {
  it('should parse simple filter values from query string', () => {
    const filterValues = '(publisher1,publisher2,publisher3)';
    const expected = ['publisher1', 'publisher2', 'publisher3'];

    const parsedValues = parseFilterValuesSingleQueryString(filterValues);

    expect(parsedValues).toEqual(expected);
  });

  it('should parse filter values with uppercase letters', () => {
    const filterValues = '(Afdeling NKR-analyse,DI Dr. Gerhard Fülöp,Helena Jericek Klanscek)';
    const expected = ['afdeling nkr-analyse', 'di dr. gerhard fülöp', 'helena jericek klanscek'];

    const parsedValues = parseFilterValuesSingleQueryString(filterValues);

    expect(parsedValues).toEqual(expected);
  });
});
