// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  RetrievedDataset,
  RetrievedDistribution,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";

export const CONFORMS_TO_STANDARDS = {
  EXTERNALLY_GOVERNED: "Externally governed",
} as const;

const EXTERNALLY_GOVERNED_LOWER =
  CONFORMS_TO_STANDARDS.EXTERNALLY_GOVERNED.toLowerCase();

export function isExternalDataset(
  dataset: SearchedDataset | RetrievedDataset
): boolean {
  if (!dataset.conformsTo?.length) {
    return false;
  }

  return dataset.conformsTo.some(
    (item) => item.value?.toLowerCase() === EXTERNALLY_GOVERNED_LOWER
  );
}

export function getFirstAccessUrl(
  distributions?: RetrievedDistribution[]
): string | undefined {
  if (!distributions?.length) {
    return undefined;
  }

  for (const distribution of distributions) {
    if (distribution.accessUrl?.trim()) {
      return distribution.accessUrl;
    }
  }

  return undefined;
}
