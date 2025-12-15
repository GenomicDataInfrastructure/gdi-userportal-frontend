// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  SearchedDataset,
  RetrievedDataset,
} from "@/app/api/discovery/open-api/schemas";
import { CONFORMS_TO_STANDARDS } from "./datasetHelpers";

const MOCK_CONFORMS_TO_VALUES = {
  EXTERNALLY_GOVERNED: CONFORMS_TO_STANDARDS.EXTERNALLY_GOVERNED,
  ONE_PLUS_MG_COMPLIANT: "1+MG compliant",
  ONE_PLUS_MG_COHORT: "1+MG cohort / EDIC controlled",
} as const;

const VALID_CONFORMS_TO_VALUES = new Set([
  MOCK_CONFORMS_TO_VALUES.EXTERNALLY_GOVERNED.toLowerCase(),
  MOCK_CONFORMS_TO_VALUES.ONE_PLUS_MG_COMPLIANT.toLowerCase(),
  MOCK_CONFORMS_TO_VALUES.ONE_PLUS_MG_COHORT.toLowerCase(),
]);

const CONFORMS_TO_OPTIONS = [
  {
    value: MOCK_CONFORMS_TO_VALUES.EXTERNALLY_GOVERNED,
    label: MOCK_CONFORMS_TO_VALUES.EXTERNALLY_GOVERNED,
  },
  {
    value: MOCK_CONFORMS_TO_VALUES.ONE_PLUS_MG_COMPLIANT,
    label: MOCK_CONFORMS_TO_VALUES.ONE_PLUS_MG_COMPLIANT,
  },
  {
    value: MOCK_CONFORMS_TO_VALUES.ONE_PLUS_MG_COHORT,
    label: MOCK_CONFORMS_TO_VALUES.ONE_PLUS_MG_COHORT,
  },
] as const;

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getRandomConformsTo(datasetId: string) {
  const hash = hashString(datasetId);
  const index = hash % 3;
  return CONFORMS_TO_OPTIONS[index];
}

export function addMockConformsTo<T extends SearchedDataset | RetrievedDataset>(
  dataset: T
): T {
  if (dataset.conformsTo?.length) {
    const hasValidValue = dataset.conformsTo.some((item) => {
      const value = (item.value || "").toLowerCase();
      return Array.from(VALID_CONFORMS_TO_VALUES).some((valid) =>
        value.includes(valid)
      );
    });

    if (hasValidValue) {
      return dataset;
    }
  }

  return {
    ...dataset,
    conformsTo: [getRandomConformsTo(dataset.id)],
  } as T;
}

export function applyMockData<T extends SearchedDataset | RetrievedDataset>(
  dataset: T
): T {
  return addMockConformsTo(dataset);
}
