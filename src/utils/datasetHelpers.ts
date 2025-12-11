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
  ONE_PLUS_MG_COMPLIANT: "1+MG compliant",
  ONE_PLUS_MG_COHORT: "1+MG cohort / EDIC controlled",
} as const;

export function isExternalDataset(
  dataset: SearchedDataset | RetrievedDataset
): boolean {
  if (!dataset.conformsTo || dataset.conformsTo.length === 0) {
    return false;
  }

  const isExternal = dataset.conformsTo.some((item) => {
    const valueOrLabel = (item.value || item.label || "").toLowerCase();
    return (
      valueOrLabel.includes("externally governed") ||
      valueOrLabel.includes("external")
    );
  });

  return isExternal;
}

export function getFirstAccessUrl(
  distributions?: RetrievedDistribution[]
): string | undefined {
  if (!distributions || distributions.length === 0) {
    return undefined;
  }

  for (const distribution of distributions) {
    if (distribution.uri?.trim()) {
      return distribution.uri;
    }

    if (distribution.accessUrl?.trim()) {
      return distribution.accessUrl;
    }

    if (distribution.downloadUrl?.trim()) {
      return distribution.downloadUrl;
    }
  }

  return undefined;
}

export function getConformsToLabel(
  dataset: SearchedDataset | RetrievedDataset
): string | undefined {
  if (!dataset.conformsTo || dataset.conformsTo.length === 0) {
    return undefined;
  }

  return dataset.conformsTo
    .map((item) => {
      const value = item.value || "";
      if (
        value.includes("Externally governed") ||
        value.includes("1+MG compliant") ||
        value.includes("EDIC controlled")
      ) {
        return value;
      }
      return item.label || item.value;
    })
    .join(", ");
}
