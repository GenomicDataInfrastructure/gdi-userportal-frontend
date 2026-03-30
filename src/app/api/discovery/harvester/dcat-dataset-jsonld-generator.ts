// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { getDatasetExportUri } from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";

const getDatasetTitleAsJsonLd = (
  dataset: LocalDiscoveryDataset
): string | undefined => dataset.title || undefined;

const getDatasetDescriptionAsJsonLd = (
  dataset: LocalDiscoveryDataset
): string | undefined => dataset.description || undefined;

export const serializeDatasetAsJsonLd = (
  dataset: LocalDiscoveryDataset
): string => {
  const document: Record<string, unknown> = {
    "@context": {
      dcat: "http://www.w3.org/ns/dcat#",
      dct: "http://purl.org/dc/terms/",
    },
    "@type": "dcat:Dataset",
  };

  document["@id"] = getDatasetExportUri(dataset);

  const title = getDatasetTitleAsJsonLd(dataset);
  if (title) {
    document["dct:title"] = title;
  }

  const description = getDatasetDescriptionAsJsonLd(dataset);
  if (description) {
    document["dct:description"] = description;
  }

  return `${JSON.stringify(document, null, 2)}\n`;
};
