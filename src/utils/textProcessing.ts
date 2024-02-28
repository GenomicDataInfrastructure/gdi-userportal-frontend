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

function truncateDescription(description: string, screenWidth: number): string {
  const maxWords = getMaxWordsForScreenSize(screenWidth);
  const words = description.split(' ');
  if (words.length > maxWords) {
    const truncatedDesc = words.slice(0, maxWords).join(' ');
    return removeEndingPunctuation(truncatedDesc) + '...';
  }
  return description;
}

function getMaxWordsForScreenSize(width: number): number {
  const screenSize = pixelWidthToScreenSize(width);
  return SCREEN_SIZE_TO_MAX_WORDS[screenSize];
}

function removeEndingPunctuation(text: string): string {
  return text.slice(0, text.length - 1) + text[text.length - 1].replace(/[.,:;!?]$/, '');
}

export { truncateDescription };
