// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import serverConfig from "@/config/serverConfig";
import { makeDatasetCount } from "./public/datasetCount";
import { datasetList } from "./public/datasetList";

const discoveryUrl = serverConfig.discoveryUrl;

const datasetCount = makeDatasetCount(discoveryUrl);

export { datasetList, datasetCount };
