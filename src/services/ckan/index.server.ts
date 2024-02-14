// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { makeDatasetList } from './datasetList';
import { makePackageShow } from './packageShow';
import serverConfig from '../../config/serverConfig';

const DMS_URL = serverConfig.ckanUrl;
const datasetList = makeDatasetList(DMS_URL);
const packageShow = makePackageShow(DMS_URL);

export { datasetList, packageShow };
