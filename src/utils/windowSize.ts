// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

enum SCREEN_SIZE {
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
}

function pixelWidthToScreenSize(width: number): SCREEN_SIZE {
  if (width < 768) return SCREEN_SIZE.SM;
  else if (width < 1024 && width >= 768) return SCREEN_SIZE.MD;
  else if (width < 1280 && width >= 1024) return SCREEN_SIZE.LG;
  return SCREEN_SIZE.XL;
}

export { SCREEN_SIZE, pixelWidthToScreenSize };
