// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import axios from 'axios';
import { Dataset } from './../../types/dataset.types';
import { mapCKANPackageToDataset, constructCkanActionUrl } from './utils';

export const makeDatasetGet = (DMS: string) => {
  return async (id: string): Promise<Dataset> => {
    const url = constructCkanActionUrl(DMS, 'package_show', `id=${id}`);
    const response = await axios.get(url);
    return mapCKANPackageToDataset(response.data.result);
  };
};
