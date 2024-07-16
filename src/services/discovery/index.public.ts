// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import serverConfig from "@/config/serverConfig";
import { makeDatasetCount } from "./public/datasetCount";
import { datasetList } from "./public/datasetList";
import { makePortalStatistics } from "./public/portalStatistics";

const discoveryUrl = serverConfig.discoveryUrl;

const datasetCount = makeDatasetCount(discoveryUrl);
const portalStatistics = makePortalStatistics(discoveryUrl);

export { datasetList, datasetCount, portalStatistics };
