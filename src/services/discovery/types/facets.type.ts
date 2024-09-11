// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ValueLabel } from "./datasetSearch.types";

export type Facet = {
  facetGroup: string;
  key: string;
  label: string;
  values: ValueLabel[];
};
