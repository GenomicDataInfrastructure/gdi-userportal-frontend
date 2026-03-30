// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { serializeDatasetAsJsonLd } from "@/app/api/discovery/harvester/dcat-dataset-jsonld-generator";
import { LocalDiscoveryDatasetExportFormat } from "@/app/api/discovery/harvester/dcat-dataset-export-types";
import { serializeDatasetAsRdfXml } from "@/app/api/discovery/harvester/dcat-dataset-rdfxml-generator";
import { serializeDatasetAsTurtle } from "@/app/api/discovery/harvester/dcat-dataset-turtle-generator";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";

export const serializeLocalDiscoveryDataset = (
  dataset: LocalDiscoveryDataset,
  format: LocalDiscoveryDatasetExportFormat
): Promise<string> => {
  switch (format) {
    case "rdf":
      return serializeDatasetAsRdfXml(dataset);
    case "ttl":
      return serializeDatasetAsTurtle(dataset);
    case "jsonld":
      return serializeDatasetAsJsonLd(dataset);
  }
};

export const getLocalDiscoveryDatasetExportMimeType = (
  format: LocalDiscoveryDatasetExportFormat
): string => {
  switch (format) {
    case "rdf":
      return "application/rdf+xml";
    case "ttl":
      return "text/turtle";
    case "jsonld":
      return "application/ld+json";
  }
};
