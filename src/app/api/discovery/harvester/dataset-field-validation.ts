// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { HarvesterRunWarning } from "@/app/api/discovery/local-store/harvester-logs/types";

const REQUIRED_FIELDS: {
  field: string;
  isPresent: (dataset: LocalDiscoveryDataset) => boolean;
}[] = [
  { field: "title", isPresent: (dataset) => Boolean(dataset.title?.trim()) },
  {
    field: "description",
    isPresent: (dataset) => Boolean(dataset.description?.trim()),
  },
  {
    field: "identifier",
    isPresent: (dataset) => Boolean(dataset.identifier?.trim()),
  },
  {
    field: "publisher",
    isPresent: (dataset) => (dataset.publishers?.length ?? 0) > 0,
  },
];

export function findMissingRequiredFields(
  dataset: LocalDiscoveryDataset
): string[] {
  return REQUIRED_FIELDS.filter(({ isPresent }) => !isPresent(dataset)).map(
    ({ field }) => field
  );
}

export function collectDatasetFieldWarnings(
  datasets: LocalDiscoveryDataset[]
): HarvesterRunWarning[] {
  return datasets.flatMap((dataset) => {
    const missingFields = findMissingRequiredFields(dataset);
    if (!missingFields.length) {
      return [];
    }

    return [
      {
        subjectId: dataset.id,
        datasetTitle: dataset.title || undefined,
        type: "missingFields" as const,
        details: missingFields,
      },
    ];
  });
}
