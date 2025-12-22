// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  RetrievedDataset,
  RetrievedDistribution,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";

const EXTERNALLY_GOVERNED_URI = "http://data.gdi.eu/core/p2/ExternallyGoverned";
const EXTERNALLY_GOVERNED_LABEL = "Externally governed";

export function isExternalDataset(
  dataset: SearchedDataset | RetrievedDataset
): boolean {
  if (!dataset.conformsTo?.length) {
    return false;
  }

  return dataset.conformsTo.some((item) => {
    if (item.name === EXTERNALLY_GOVERNED_URI) {
      console.log(`✓ External (by URI): ${dataset.id}`);
      return true;
    }
    if (item.value?.toLowerCase() === EXTERNALLY_GOVERNED_LABEL.toLowerCase()) {
      console.log(`✓ External (by value): ${dataset.id}`);
      return true;
    }
    if (item.label?.toLowerCase() === EXTERNALLY_GOVERNED_LABEL.toLowerCase()) {
      console.log(`✓ External (by label): ${dataset.id}`);
      return true;
    }
    return false;
  });
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
