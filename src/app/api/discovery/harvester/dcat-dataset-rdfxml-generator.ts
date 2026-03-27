// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import {
  escapeXml,
  getDatasetRdfAboutAttribute,
} from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";

const XML_PREFIXES = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:dcat="http://www.w3.org/ns/dcat#"
         xmlns:dct="http://purl.org/dc/terms/">`;

const getDatasetTitleAsRdfXml = (dataset: LocalDiscoveryDataset): string =>
  dataset.title
    ? `    <dct:title>${escapeXml(dataset.title)}</dct:title>\n`
    : "";

const getDatasetDescriptionAsRdfXml = (
  dataset: LocalDiscoveryDataset
): string =>
  dataset.description
    ? `    <dct:description>${escapeXml(dataset.description)}</dct:description>\n`
    : "";

export const serializeDatasetAsRdfXml = (
  dataset: LocalDiscoveryDataset
): string => {
  const datasetBody = [
    getDatasetTitleAsRdfXml(dataset),
    getDatasetDescriptionAsRdfXml(dataset),
  ].join("");

  return `${XML_PREFIXES}
  <dcat:Dataset${getDatasetRdfAboutAttribute(dataset)}>
${datasetBody}  </dcat:Dataset>
</rdf:RDF>
`;
};
