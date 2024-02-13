// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { makePackageSearch } from './packageSearch';
import { makePackageShow } from './packageShow';
import serverConfig from '../../config/serverConfig';

const DMS_URL = serverConfig.ckanUrl;
const packageSearch = makePackageSearch(DMS_URL);
const packageShow = makePackageShow(DMS_URL);

export { packageSearch, packageShow };
