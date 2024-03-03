// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { constructCkanActionUrl } from './utils';

export const makeDatasetCount = (DMS: string) => {
  return async (): Promise<number> => {
    const url = constructCkanActionUrl(DMS, 'dataset_list');
    const response = await axios.get(url);
    return response.data.result.count;
  };
};
