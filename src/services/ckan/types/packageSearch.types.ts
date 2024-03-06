// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { Dataset } from './../../../types/dataset.types';

export interface PackageSearchOptions {
  tags?: string[];
  orgs?: string[];
  groups?: string[];
  publishers?: string[];
  resFormat?: string[];
  offset?: number;
  limit?: number;
  query?: string;
  sort?: string;
  include_private?: boolean;
}

export interface PackageSearchResult {
  datasets: Dataset[];
  count: number;
}
