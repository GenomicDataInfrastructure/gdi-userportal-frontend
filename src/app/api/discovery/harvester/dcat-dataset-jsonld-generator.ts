// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { serializeDatasetStore } from "@/app/api/discovery/harvester/dcat-dataset-rdf-serializer";

export const serializeDatasetAsJsonLd = (
  dataset: LocalDiscoveryDataset
): Promise<string> => serializeDatasetStore(dataset, "jsonld");
