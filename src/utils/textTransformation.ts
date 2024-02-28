// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { pixelWidthToScreenSize } from './windowSize';

const SCREEN_SIZE_TO_MAX_WORDS = {
  XL: 100,
  LG: 70,
  MD: 40,
  SM: 30,
};

function getMaxWordsForScreenSize(width: number): number {
  const screenSize = pixelWidthToScreenSize(width);
  return SCREEN_SIZE_TO_MAX_WORDS[screenSize];
}

function truncateDescription(description: string, screenWidth: number): string {
  const maxWords = getMaxWordsForScreenSize(screenWidth);
  const words = description.split(' ');
  if (words.length > maxWords) {
    return (words.slice(0, maxWords).join(' ') + '...').replace('....', '...');
  }
  return description;
}

export { truncateDescription };
