// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import serverConfig from "../../config/serverConfig";
import { makeDatasetGet } from "./datasetGet";
import { makeDatasetList } from "./datasetList";

const discoveryUrl = serverConfig.discoveryUrl;

const datasetGet = makeDatasetGet(discoveryUrl);
const datasetList = makeDatasetList(discoveryUrl);

export { datasetGet, datasetList };
