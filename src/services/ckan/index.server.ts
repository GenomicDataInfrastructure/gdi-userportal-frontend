// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { makeDatasetCount } from './datasetCount';

import serverConfig from '../../config/serverConfig';
import { makeDatasetGet } from './datasetGet';
import { makeDatasetList } from './datasetList';
import { makeFieldDetailsGet } from './fieldDetailsGet';

const DMS_URL = serverConfig.ckanUrl;
const datasetList = makeDatasetList(DMS_URL);
const datasetGet = makeDatasetGet(DMS_URL);
const datasetCount = makeDatasetCount(DMS_URL);
const fieldDetailsGet = makeFieldDetailsGet(DMS_URL);

export { datasetCount, datasetGet, datasetList, fieldDetailsGet };
