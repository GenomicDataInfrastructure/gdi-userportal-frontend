// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  RetrievedDataset,
  DatasetRelationship,
} from "@/services/discovery/types/dataset.types";

/**
 * Formats a camelCase string to a more readable format.
 * @param type - The relationship type string to format.
 * @returns The formatted string.
 */
export function formatRelationshipType(type: string): string {
  const parts = type.split(":");
  if (parts.length < 2) return type;

  const camelCase = parts[1];
  const result = camelCase.replace(/([A-Z])/g, " $1").trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Parses dataset relationships from a stringified JSON.
 * @param dataset - The dataset object containing the dataset_relationships property.
 * @returns An array of parsed dataset relationships.
 */
export function parseDatasetRelationships(
  dataset: RetrievedDataset
): Array<DatasetRelationship> {
  return dataset.dataset_relationships
    ? JSON.parse(dataset.dataset_relationships)
    : [];
}
