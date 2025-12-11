// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  SearchedDataset,
  RetrievedDataset,
} from "@/app/api/discovery/open-api/schemas";
import { CONFORMS_TO_STANDARDS } from "./datasetHelpers";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getRandomConformsTo(datasetId: string): {
  value: string;
  label: string;
} {
  const hash = hashString(datasetId);
  const index = hash % 3;

  const values = [
    {
      value: CONFORMS_TO_STANDARDS.EXTERNALLY_GOVERNED,
      label: CONFORMS_TO_STANDARDS.EXTERNALLY_GOVERNED,
    },
    {
      value: CONFORMS_TO_STANDARDS.ONE_PLUS_MG_COMPLIANT,
      label: CONFORMS_TO_STANDARDS.ONE_PLUS_MG_COMPLIANT,
    },
    {
      value: CONFORMS_TO_STANDARDS.ONE_PLUS_MG_COHORT,
      label: CONFORMS_TO_STANDARDS.ONE_PLUS_MG_COHORT,
    },
  ];

  return values[index];
}

export function addMockConformsTo<T extends SearchedDataset | RetrievedDataset>(
  dataset: T
): T {
  if (dataset.conformsTo && dataset.conformsTo.length > 0) {
    const hasValidValue = dataset.conformsTo.some((item) => {
      const value = (item.value || "").toLowerCase();
      return (
        value.includes("externally governed") ||
        value.includes("1+mg compliant") ||
        value.includes("edic controlled")
      );
    });

    if (hasValidValue) {
      return dataset;
    }
  }

  const conformsTo = getRandomConformsTo(dataset.id);

  return {
    ...dataset,
    conformsTo: [conformsTo],
  } as T;
}

export function applyMockData<T extends SearchedDataset | RetrievedDataset>(
  dataset: T
): T {
  return addMockConformsTo(dataset);
}
