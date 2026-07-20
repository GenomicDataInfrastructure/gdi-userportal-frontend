// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { serializeDatasetStore } from "@/app/api/discovery/harvester/dcat-dataset-rdf-serializer";
import { applyRdfXmlPostProcessing } from "@/app/api/discovery/harvester/rdfxml-post-processor";

export const serializeDatasetAsRdfXml = async (
  dataset: LocalDiscoveryDataset
): Promise<string> => {
  const xml = await serializeDatasetStore(dataset, "rdf");
  return applyRdfXmlPostProcessing(xml);
};
