// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SCREEN_SIZE } from './windowSize';

const SCREEN_SIZE_TO_MAX_WORDS = {
  XL: 100,
  LG: 70,
  MD: 40,
  SM: 30,
};

function truncateDescription(description: string, screenSize: SCREEN_SIZE): string {
  const maxWords = getMaxWordsForScreenSize(screenSize);
  const words = description.split(' ');
  if (words.length > maxWords) {
    const truncatedDesc = words.slice(0, maxWords).join(' ');
    return removeEndingPunctuation(truncatedDesc) + '...';
  }
  return description;
}

function getMaxWordsForScreenSize(size: SCREEN_SIZE): number {
  return SCREEN_SIZE_TO_MAX_WORDS[size];
}

function removeEndingPunctuation(text: string): string {
  return text.slice(0, text.length - 1) + text[text.length - 1].replace(/[.,:;!?]$/, '');
}

export { truncateDescription };
