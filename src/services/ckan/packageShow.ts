// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import axios from 'axios';
import { Dataset } from './../../interfaces/dataset.interface';
import { mapDataset, constructCkanActionUrl } from './utils';

export const makePackageShow = (DMS: string) => {
  return async (id: string): Promise<Dataset> => {
    const url = constructCkanActionUrl(DMS, 'package_show', `id=${id}`);
    const response = await axios.get(url);
    return mapDataset(response.data.result);
  };
};
