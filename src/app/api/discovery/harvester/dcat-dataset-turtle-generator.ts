// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import {
  escapeTurtleLiteral,
  getDatasetTurtleSubject,
} from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";

const TTL_PREFIXES = `@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix dct: <http://purl.org/dc/terms/> .`;

const getDatasetTitleAsTurtle = (
  dataset: LocalDiscoveryDataset
): string | null =>
  dataset.title ? `  dct:title "${escapeTurtleLiteral(dataset.title)}"` : null;

const getDatasetDescriptionAsTurtle = (
  dataset: LocalDiscoveryDataset
): string | null =>
  dataset.description
    ? `  dct:description "${escapeTurtleLiteral(dataset.description)}"`
    : null;

export const serializeDatasetAsTurtle = (
  dataset: LocalDiscoveryDataset
): string => {
  const predicates = [
    getDatasetTitleAsTurtle(dataset),
    getDatasetDescriptionAsTurtle(dataset),
  ].filter((value): value is string => value !== null);

  if (!predicates.length) {
    return `${TTL_PREFIXES}

${getDatasetTurtleSubject(dataset)} a dcat:Dataset .
`;
  }

  return `${TTL_PREFIXES}

${getDatasetTurtleSubject(dataset)} a dcat:Dataset ;
${predicates.join(" ;\n")} .
`;
};
