// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import serverConfig from "../../config/serverConfig";
import { makeDatasetGet } from "./datasetGet";
import { makeDatasetList } from "./datasetList";
import { makeOrganizationList } from "./organizationGet";

const discoveryUrl = serverConfig.discoveryUrl;

const datasetGet = makeDatasetGet(discoveryUrl);
const datasetList = makeDatasetList(discoveryUrl);
const organizationGet = makeOrganizationList(discoveryUrl);

export { datasetGet, datasetList, organizationGet };
