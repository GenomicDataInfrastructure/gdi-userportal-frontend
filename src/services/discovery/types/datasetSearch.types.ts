// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SearchedDataset } from "./dataset.types";
import { Operator } from "@/services/discovery/types/filter.type";

export interface DatasetSearchOptions {
  query?: string;
  facets?: Facet[];
  sort?: string;
  rows?: number;
  start?: number;
  operator?: QueryOperator;
}

export type Facet = {
  source: string;
  type: string;
  key: string;
  value?: string;
  operator?: Operator;
  entries?: FacetEntry[];
};

export type FacetEntry = {
  key: string;
  value: string;
};

export type ValueLabel = {
  label: string;
  value: string;
  count?: number;
};

export type DatasetsSearchResponse = {
  count: number;
  results: SearchedDataset[];
};

export enum QueryOperator {
  And = "AND",
  Or = "OR",
}
