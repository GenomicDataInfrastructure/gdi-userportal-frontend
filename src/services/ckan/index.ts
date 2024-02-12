// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { makePackageSearch } from './packageSearch';

// TODO: Take from config in next PR
const DMS_URL = 'http://example.com';
const packageSearch = makePackageSearch(DMS_URL);

export { packageSearch };
