// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SCREEN_SIZE, pixelWidthToScreenSize } from '../windowSize';

describe('windowSize', () => {
  it('should return small (SM) for size of 600px', () => {
    const pixelSize = 600;
    const expected = SCREEN_SIZE.SM;

    const result = pixelWidthToScreenSize(pixelSize);

    expect(result).toEqual(expected);
  });

  it('should return large (LG) for size of 1024px', () => {
    const pixelSize = 1024;
    const expected = SCREEN_SIZE.LG;

    const result = pixelWidthToScreenSize(pixelSize);

    expect(result).toEqual(expected);
  });

  it('should return extra large (XL) for size of 1280px', () => {
    const pixelSize = 1280;
    const expected = SCREEN_SIZE.XL;

    const result = pixelWidthToScreenSize(pixelSize);

    expect(result).toEqual(expected);
  });
});
