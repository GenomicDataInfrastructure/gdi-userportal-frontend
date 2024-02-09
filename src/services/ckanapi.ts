// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import axios from 'axios';
import { Dataset } from './../interfaces/dataset.interface';
import { PackageSearchOptions, PackageSearchResult } from './../interfaces/packageSearch.interface';

export default class CKAN {
  DMS: string;

  constructor(DMS: string) {
    this.DMS = DMS;
  }

  async packageSearch(options: PackageSearchOptions): Promise<PackageSearchResult> {
    const queryParams = this.constructQueryParams(options);
    const url = `${this.DMS}/api/3/action/package_search?${queryParams}`;

    try {
      const response = await axios.get(url);
      return {
        datasets: response.data.result.results,
        count: response.data.result.count,
      };
    } catch (error) {
      // Handle errors more specifically based on your needs
      throw new Error(`HTTP error! ${error}`);
    }
  }

  private buildFilterQueryPart(filters: string[]): string {
    return filters.length > 0 ? `(${filters.join(' OR ')})` : '';
  }

  private constructQueryParams(options: PackageSearchOptions): string {
    const groupFilter = this.buildFilterQueryPart(options.groups || []);
    const orgFilter = this.buildFilterQueryPart(options.orgs || []);
    const tagFilter = this.buildFilterQueryPart(options.tags || []);
    const resFormatFilter = this.buildFilterQueryPart(options.resFormat || []);

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
  }
}
