// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export enum Field {
  THEME = 'theme',
  KEYWORD = 'keyword',
  DATASET = 'dataset',
  CATALOGUE = 'catalogue',
  PUBLISHER = 'publisher',
}

export type FieldDetails = {
  field: Field;
  values: string[];
  count: number;
};
