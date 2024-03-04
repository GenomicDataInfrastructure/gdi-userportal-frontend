// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Field, FieldDetails } from './types/fieldDetails.types';
import { constructCkanActionUrl } from './utils';

export const makeFieldDetailsGet = (DMS: string) => {
  return async (field: Field): Promise<FieldDetails> => {
    const url = constructCkanActionUrl(DMS, `${field}_list`);
    try {
      const response = await fetch(url);
      const data = await response.json();
      const uniqueData = Array.from(new Set<string>(data.result.results)).sort((a: string, b: string) => a.localeCompare(b));
      return {
        field,
        count: uniqueData.length,
        values: uniqueData,
      };
    } catch (error) {
      throw new Error(`HTTP error! ${error}`);
    }
  };
};
