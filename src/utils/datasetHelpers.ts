// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  RetrievedDataset,
  RetrievedDistribution,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";

const EXTERNALLY_GOVERNED_URI = "http://data.gdi.eu/core/p2/ExternallyGoverned";

export function isExternalDataset(
  dataset: SearchedDataset | RetrievedDataset
): boolean {
  return dataset.conformsTo?.some((item) => item.value === EXTERNALLY_GOVERNED_URI) ?? false;
}

export function getExternalDatasetInfo(
  dataset: SearchedDataset | RetrievedDataset
): { isExternal: boolean; label?: string } {
  const item = dataset.conformsTo?.find(
    (item) => item.value === EXTERNALLY_GOVERNED_URI
  );
  return { isExternal: !!item, label: item?.label };
}

export function getFirstAccessUrl(
  distributions?: RetrievedDistribution[]
): string | undefined {
  return distributions?.find((dist) => dist.accessUrl?.trim())?.accessUrl;
}
