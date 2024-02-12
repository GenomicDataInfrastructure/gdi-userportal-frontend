// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import axios from 'axios';
import { Dataset } from './../../interfaces/dataset.interface';
import { PackageSearchOptions, PackageSearchResult } from './../../interfaces/packageSearch.interface';
import { snakeToCamelCase } from './../../utils/snakeToCamelCase';

interface RawDataset {
  [key: string]: string | string[] | null;
}

export const makePackageSearch = (DMS: string) => {
  return async (options: PackageSearchOptions): Promise<PackageSearchResult> => {
    const queryParams = constructQueryParams(options);
    const url = `${DMS}/api/3/action/package_search?${queryParams}`;

    try {
      const response = await axios.get(url);
      return {
        datasets: mapDatasets(response.data.result.results),
        count: response.data.result.count,
      };
    } catch (error) {
      throw new Error(`HTTP error! ${error}`);
    }
  };
};

const buildFilterQueryPart = (filters: string[]): string => {
  return filters.length > 0 ? `(${filters.join(' OR ')})` : '';
};

const constructQueryParams = (options: PackageSearchOptions): string => {
  const groupFilter = buildFilterQueryPart(options.groups || []);
  const orgFilter = buildFilterQueryPart(options.orgs || []);
  const tagFilter = buildFilterQueryPart(options.tags || []);
  const resFormatFilter = buildFilterQueryPart(options.resFormat || []);

  const filters = [
    groupFilter && `groups:${groupFilter}`,
    orgFilter && `organization:${orgFilter}`,
    tagFilter && `tags:${tagFilter}`,
    resFormatFilter && `res_format:${resFormatFilter}`,
  ]
    .filter(Boolean)
    .join('+');

  let queryParams = `start=${options.offset || 0}&rows=${options.limit || 10}`;
  queryParams += filters ? `&fq=${filters}` : '';
  queryParams += options.query ? `&q=${options.query}` : '';
  queryParams += options.sort ? `&sort=${options.sort}` : '';
  queryParams += options.include_private ? `&include_private=${options.include_private}` : '';

  return queryParams;
};

const mapDatasets = (rawDatasets: RawDataset[]): Dataset[] => {
  return rawDatasets.map((rawDataset: RawDataset) => {
    const mappedDataset: { [key: string]: any } = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    Object.keys(rawDataset).forEach((key) => {
      const camelCaseKey = snakeToCamelCase(key);
      mappedDataset[camelCaseKey] = rawDataset[key];
    });
    return mappedDataset as Dataset;
  });
};
