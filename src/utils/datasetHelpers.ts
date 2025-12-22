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

  const normalizedLabel = EXTERNALLY_GOVERNED_LABEL.toLowerCase();

  return dataset.conformsTo.some((item) => {
    if (
      item.name === EXTERNALLY_GOVERNED_URI ||
      item.value === EXTERNALLY_GOVERNED_URI ||
      item.label === EXTERNALLY_GOVERNED_URI
    ) {
      return true;
    }

    const displayNameMatch = item.display_name?.toLowerCase() === normalizedLabel;
    const valueMatch = item.value?.toLowerCase() === normalizedLabel;
    const labelMatch = item.label?.toLowerCase() === normalizedLabel;

    return displayNameMatch || valueMatch || labelMatch;
  });
}

export function getFirstAccessUrl(
  distributions?: RetrievedDistribution[]
): string | undefined {
  return distributions?.find((dist) => dist.accessUrl?.trim())?.accessUrl;
}
