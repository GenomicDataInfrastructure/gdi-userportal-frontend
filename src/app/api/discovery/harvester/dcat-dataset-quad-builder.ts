// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { DATASET_EXPORT_PREFIXES } from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";
import {
  createDatasetRdfContext,
  RdfStore,
} from "@/app/api/discovery/harvester/rdf/context";
import { addDatasetAgentQuads } from "@/app/api/discovery/harvester/rdf/mappers/dataset-agent-quad-mapper";
import { addDatasetClassificationQuads } from "@/app/api/discovery/harvester/rdf/mappers/dataset-classification-quad-mapper";
import { addDatasetContactQuads } from "@/app/api/discovery/harvester/rdf/mappers/dataset-contact-quad-mapper";
import { addDatasetCoreQuads } from "@/app/api/discovery/harvester/rdf/mappers/dataset-core-quad-mapper";
import { addDatasetCoverageQuads } from "@/app/api/discovery/harvester/rdf/mappers/dataset-coverage-quad-mapper";
import { addDatasetDistributionQuads } from "@/app/api/discovery/harvester/rdf/mappers/dataset-distribution-quad-mapper";
import { addDatasetGovernanceQuads } from "@/app/api/discovery/harvester/rdf/mappers/dataset-governance-quad-mapper";
import { addDatasetRelationQuads } from "@/app/api/discovery/harvester/rdf/mappers/dataset-relation-quad-mapper";

export const buildDatasetRdfStore = (
  dataset: LocalDiscoveryDataset
): RdfStore => {
  const context = createDatasetRdfContext(dataset);

  addDatasetCoreQuads(context);
  addDatasetCoverageQuads(context);
  addDatasetClassificationQuads(context);
  addDatasetGovernanceQuads(context);
  addDatasetAgentQuads(context);
  addDatasetContactQuads(context);
  addDatasetRelationQuads(context);
  addDatasetDistributionQuads(context);

  return context.store;
};

export const getDatasetExportPrefixes = (): Record<string, string> => ({
  ...DATASET_EXPORT_PREFIXES,
});
