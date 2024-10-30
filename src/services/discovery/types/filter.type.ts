// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ValueLabel } from "./datasetSearch.types";

export type Filter = {
  source: string;
  group: string;
  type: FilterType;
  key: string;
  label: string;
  values?: ValueLabel[];
  operators?: Operator[];
  entries?: FilterEntry;
};

export enum FilterType {
  DROPDOWN = "DROPDOWN",
  FREE_TEXT = "FREE_TEXT",
  ENTRIES = "ENTRIES",
}

export enum Operator {
  EQUALS = "=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  DIFFERENT = "!=",
  CONTAINS = "%",
}

export type FilterEntry = {
  key: string;
  label: string;
};
