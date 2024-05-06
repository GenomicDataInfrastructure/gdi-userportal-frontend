// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { truncateDescription } from '../textProcessing';
import { SCREEN_SIZE } from '../windowSize';

describe('Truncate description', () => {
  it('should truncate description to 30 words for screen of 700px (small)', () => {
    const description =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research. The BMIA XNAT will be used as main image data storage platform for centralized storage. As first usecase, breast cancer was identified, for which the first datasets will be collected from the University of Barcelona. The data will first be available to partners within the consortium, but will potentially be publicly released';
    const expected =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research. The BMIA XNAT will be used as main image...';

    const truncatedDesc = truncateDescription(description, SCREEN_SIZE.SM);

    expect(truncatedDesc).toEqual(expected);
  });

  it('should not truncate description of 30 words for screen of 700px (small)', () => {
    const description =
      'International Carotid Stenting Study (ICSS or ICS). To compare the risks, benefits and cost effectiveness of a treatment policy of referral for carotid stenting compared with referral for carotid surgery.';
    const expected =
      'International Carotid Stenting Study (ICSS or ICS). To compare the risks, benefits and cost effectiveness of a treatment policy of referral for carotid stenting compared with referral for carotid surgery.';

    const truncatedDesc = truncateDescription(description, SCREEN_SIZE.SM);

    expect(truncatedDesc).toEqual(expected);
  });

  it('should truncate description to 40 words for screen of 1000px (medium)', () => {
    const description =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research. The BMIA XNAT will be used as main image data storage platform for centralized storage. As first usecase, breast cancer was identified, for which the first datasets will be collected from the University of Barcelona. The data will first be available to partners within the consortium, but will potentially be publicly released';
    const expected =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research. The BMIA XNAT will be used as main image data storage platform for centralized storage. As first usecase, breast...';

    const truncatedDesc = truncateDescription(description, SCREEN_SIZE.MD);

    expect(truncatedDesc).toEqual(expected);
  });

  it('should get rid of potential punctuation in cut-off position and replace it with ellipsis, while keeping all other punctuations', () => {
    const description =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research? The BMIA XNAT will be used as main image! data storage platform for centralized storage. As first usecase, breast cancer was identified, for which the first datasets will be collected from the University of Barcelona. The data will first be available to partners within the consortium, but will potentially be publicly released';
    const expected =
      'Within the EuCanImage project (https://eucanimage.eu/), imaging datasets are collected from multiple sites to facilitate the use of AI for cancer research? The BMIA XNAT will be used as main image...';

    const truncatedDesc = truncateDescription(description, SCREEN_SIZE.SM);

    expect(truncatedDesc).toEqual(expected);
  });
});
