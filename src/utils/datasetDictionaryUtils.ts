// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  RetrievedDataset,
  DatasetDictionaryEntry,
} from "@/services/discovery/types/dataset.types";

/**
 * Parses dataset dictionary entries from a stringified JSON.
 * @param dataset - The dataset object containing the dataset_dictionary property.
 * @returns An array of parsed dataset dictionary entries.
 */
export function parseDatasetDictionary(
  dataset: RetrievedDataset
): Array<DatasetDictionaryEntry> {
  return dataset.dataset_dictionary
    ? JSON.parse(dataset.dataset_dictionary)
    : [];
}

/**
 * Formats a camelCase string to a more readable format.
 * @param fieldName - The field name string to format.
 * @returns The formatted string.
 */
export function formatFieldName(fieldName: string): string {
  return fieldName.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Formats a camelCase string to a more readable format.
 * @param description - The description string to format.
 * @returns The formatted string.
 */
export function formatDescription(description: string): string {
  return description.charAt(0).toUpperCase() + description.slice(1);
}
