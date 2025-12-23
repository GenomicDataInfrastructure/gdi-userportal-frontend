// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  RetrievedDataset,
  RetrievedDistribution,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";

const EXTERNALLY_GOVERNED_URI = "http://data.gdi.eu/core/p2/ExternallyGoverned";

export function getExternalDatasetInfo(
  dataset: SearchedDataset | RetrievedDataset
): { isExternal: boolean; label?: string } {
  const item = (Array.isArray(dataset.conformsTo) ? dataset.conformsTo : [dataset.conformsTo])?.find(
    (c) => (typeof c === "string" ? c : c?.value) === EXTERNALLY_GOVERNED_URI || 
           (typeof c === "object" && c?.label?.toLowerCase().includes("external"))
  );

  return {
    isExternal: !!item,
    label: typeof item === "object" ? item?.label : undefined,
  };
}

export const getFirstAccessUrl = (
  distributions?: RetrievedDistribution[]
): string | undefined => distributions?.find((d) => d.accessUrl?.trim())?.accessUrl;
