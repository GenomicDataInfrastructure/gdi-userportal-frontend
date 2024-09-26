// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import serverConfig from "../../config/serverConfig";
import { makeDatasetGet } from "./datasetGet";
import { makeDatasetList } from "./datasetList";
import { makeFacetList } from "./facetList";
import { makePublisherList } from "./publisherList";
import { makeRetrieveDatasetAsFile } from "./retrieveDatasetAsFile";

const discoveryUrl = serverConfig.discoveryUrl;

const datasetGet = makeDatasetGet(discoveryUrl);
const datasetList = makeDatasetList(discoveryUrl);
const publisherList = makePublisherList(discoveryUrl);
const facetList = makeFacetList(discoveryUrl);
const retrieveDatasetAsFile = makeRetrieveDatasetAsFile(discoveryUrl);

export {
  datasetGet,
  datasetList,
  publisherList,
  facetList,
  retrieveDatasetAsFile,
};
