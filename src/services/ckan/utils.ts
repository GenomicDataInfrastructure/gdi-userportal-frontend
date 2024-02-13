// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { snakeToCamelCase } from './../../utils/snakeToCamelCase';
import { Dataset } from './../../interfaces/dataset.interface';

export interface RawDataset {
  [key: string]: string | string[] | null;
}

export const mapDataset = (rawDataset: RawDataset): Dataset => {
  const mappedDataset: { [key: string]: any } = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  Object.keys(rawDataset).forEach((key) => {
    const camelCaseKey = snakeToCamelCase(key);
    mappedDataset[camelCaseKey] = rawDataset[key];
  });
  return mappedDataset as Dataset;
};

export const constructCkanActionUrl = (DMS: string, action: string, queryParams: string = ''): string => {
  return `${DMS}/api/3/action/${action}?${queryParams}`;
};
