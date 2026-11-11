// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { LocalDiscoveryDatasetExportFormat } from "@/app/api/discovery/harvester/dcat-dataset-export-types";
import {
  buildDatasetRdfStore,
  getDatasetExportPrefixes,
} from "@/app/api/discovery/harvester/dcat-dataset-quad-builder";
import { serializeRdfStore } from "@/app/api/discovery/harvester/rdf/rdf-serializer";

export const serializeDatasetStore = async (
  dataset: LocalDiscoveryDataset,
  format: LocalDiscoveryDatasetExportFormat
): Promise<string> =>
  serializeRdfStore(
    buildDatasetRdfStore(dataset),
    getDatasetExportPrefixes(),
    format
  );
