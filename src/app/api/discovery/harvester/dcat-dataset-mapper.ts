// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

export const DCAT_DATASET = "http://www.w3.org/ns/dcat#Dataset";
export const DCAT_CATALOG = "http://www.w3.org/ns/dcat#Catalog";

const DCAT_IN_CATALOG = "http://www.w3.org/ns/dcat#inCatalog";
const DCT_IDENTIFIER = "http://purl.org/dc/terms/identifier";
const DCT_TITLE = "http://purl.org/dc/terms/title";
const DC_TITLE = "http://purl.org/dc/elements/1.1/title";
const DCT_DESCRIPTION = "http://purl.org/dc/terms/description";
const DC_DESCRIPTION = "http://purl.org/dc/elements/1.1/description";
const DCT_LANGUAGE = "http://purl.org/dc/terms/language";

export const getFallbackCatalogue = (graph: RdfGraph): string => {
  const namedCatalogs = graph
    .getSubjectsOfType(DCAT_CATALOG)
    .filter((catalog) => catalog.termType === "NamedNode");

  if (namedCatalogs.length !== 1) {
    return "";
  }

  return getCatalogueLabel(namedCatalogs[0], graph);
};

export const mapDataset = (
  datasetSubject: RDF.Term,
  graph: RdfGraph,
  fallbackCatalogue: string,
  index: number
): LocalDiscoveryDataset => {
  const identifier = getDatasetIdentifier(datasetSubject, graph);

  return {
    id: getDatasetId(datasetSubject, identifier, graph, index),
    identifier,
    title: getDatasetTitle(datasetSubject, graph),
    description: getDatasetDescription(datasetSubject, graph),
    catalogue: getDatasetCatalogue(datasetSubject, graph, fallbackCatalogue),
    languages: getDatasetLanguages(datasetSubject, graph),
  };
};

const getDatasetIdentifier = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string => graph.getLiteral(datasetSubject, DCT_IDENTIFIER);

const getDatasetTitle = (datasetSubject: RDF.Term, graph: RdfGraph): string =>
  graph.getFirstLiteral(datasetSubject, [DCT_TITLE, DC_TITLE]);

const getDatasetDescription = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string =>
  graph.getFirstLiteral(datasetSubject, [DCT_DESCRIPTION, DC_DESCRIPTION]);

const getDatasetLanguages = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string[] => graph.getObjectValues(datasetSubject, DCT_LANGUAGE);

const getDatasetCatalogue = (
  datasetSubject: RDF.Term,
  graph: RdfGraph,
  fallbackCatalogue: string
): string => {
  for (const catalogObject of graph.getObjects(
    datasetSubject,
    DCAT_IN_CATALOG
  )) {
    const catalogue = getCatalogueLabel(catalogObject, graph);
    if (catalogue) {
      return catalogue;
    }
  }

  return fallbackCatalogue;
};

const getCatalogueLabel = (catalogSubject: RDF.Term, graph: RdfGraph): string =>
  graph.getFirstLiteral(catalogSubject, [DCT_TITLE, DC_TITLE]) ||
  graph.getNamedNodeValue(catalogSubject);

const getDatasetId = (
  datasetSubject: RDF.Term,
  identifier: string,
  graph: RdfGraph,
  index: number
): string => {
  if (identifier) {
    return identifier;
  }

  const subjectValue = graph.getNamedNodeValue(datasetSubject);
  if (subjectValue) {
    return subjectValue;
  }

  return `dataset-${index + 1}`;
};
