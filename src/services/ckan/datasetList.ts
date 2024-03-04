// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import axios from 'axios';
import { PackageSearchOptions, PackageSearchResult } from './types/packageSearch.types';
import { constructCkanActionUrl, mapCKANPackageToDataset } from './utils';

export const makeDatasetList = (DMS: string) => {
  return async (options: PackageSearchOptions): Promise<PackageSearchResult> => {
    const queryParams = constructQueryParams(options);
    const url = constructCkanActionUrl(DMS, 'package_search', queryParams);

    try {
      const response = await axios.get(url);
      return {
        datasets: response.data.result.results.map(mapCKANPackageToDataset),
        count: response.data.result.count,
      };
    } catch (error) {
      throw new Error(`HTTP error! ${error}`);
    }
  };
};

const buildFilterQueryPart = (filters: string[]): string => {
  return filters.length > 0
    ? `(${filters
        .map((filter: string) => (filter.startsWith('http') ? `"${filter}"` : filter))
        .map((value: string) => (value.includes(' ') ? `"${value}"` : value))
        .join(' OR ')})`
    : '';
};

const constructQueryParams = (options: PackageSearchOptions): string => {
  const groupFilter = buildFilterQueryPart(options.groups || []);
  const orgFilter = buildFilterQueryPart(options.orgs || []);
  const tagFilter = buildFilterQueryPart(options.tags || []);
  const publisherFilter = buildFilterQueryPart(options.publishers || []);
  const resFormatFilter = buildFilterQueryPart(options.resFormat || []);

  const filters = [
    groupFilter && `groups:${groupFilter}`,
    orgFilter && `organization:${orgFilter}`,
    tagFilter && `tags:${tagFilter}`,
    publisherFilter && `publisher:${publisherFilter}`,
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
