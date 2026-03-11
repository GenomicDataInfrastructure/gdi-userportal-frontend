// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

export const DCAT_DATASET = "http://www.w3.org/ns/dcat#Dataset";
export const DCAT_CATALOG = "http://www.w3.org/ns/dcat#Catalog";

/* eslint-disable @typescript-eslint/no-inferrable-types */
// NOSONAR: These are RDF vocabulary URIs (identifiers, not network endpoints) and must use http as defined by their specifications.
const DCAT_IN_CATALOG = "http://www.w3.org/ns/dcat#inCatalog"; // NOSONAR
const DCT_IDENTIFIER = "http://purl.org/dc/terms/identifier"; // NOSONAR
const DCT_TITLE = "http://purl.org/dc/terms/title"; // NOSONAR
const DC_TITLE = "http://purl.org/dc/elements/1.1/title"; // NOSONAR
const DCT_DESCRIPTION = "http://purl.org/dc/terms/description"; // NOSONAR
const DC_DESCRIPTION = "http://purl.org/dc/elements/1.1/description"; // NOSONAR
const DCT_LANGUAGE = "http://purl.org/dc/terms/language"; // NOSONAR
const DCT_ISSUED = "http://purl.org/dc/terms/issued"; // NOSONAR
const DCT_MODIFIED = "http://purl.org/dc/terms/modified"; // NOSONAR
const DCAT_VERSION = "http://www.w3.org/ns/dcat#version"; // NOSONAR
const DCAT_HAS_VERSION = "http://www.w3.org/ns/dcat#hasVersion"; // NOSONAR
const ADMS_VERSION_NOTES = "http://www.w3.org/ns/adms#versionNotes"; // NOSONAR
const HEALTHDCATAP_POPULATION_COVERAGE = "http://data.europa.eu/r5r/populationCoverage"; // NOSONAR
const DCAT_SPATIAL_COVERAGE = "http://publications.europa.eu/resource/authority/country/LUX"; // NOSONAR
const DCAT_SPATIAL_RESOLUTION_IN_METERS = "http://www.w3.org/ns/dcat#spatialResolutionInMeters"; // NOSONAR

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
    createdAt: normalizeDate(graph.getLiteral(datasetSubject, DCT_ISSUED)),
    modifiedAt: normalizeDate(graph.getLiteral(datasetSubject, DCT_MODIFIED)),
    version: graph.getLiteral(datasetSubject, DCAT_VERSION),
    hasVersions: objectsToValueLabel(
      graph.getObjects(datasetSubject, DCAT_HAS_VERSION)
    ),
    versionNotes: graph.getLiteral(datasetSubject, ADMS_VERSION_NOTES),
    spatialCoverage: extractSpatialCoverage(datasetSubject, graph),
    populationCoverage: extractPopulationCoverage(datasetSubject, graph),
    spatialResolutionInMeters: extractSpatialResolutionInMeters(
      datasetSubject,
      graph
    ),
  };
};

const objectsToValueLabel = (
  objects: RDF.Term[]
): Array<{ value: string; label: string }> | undefined => {
  if (objects.length === 0) return undefined;
  return objects.map((obj) => ({ value: obj.value, label: obj.value }));
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

const normalizeDate = (value: string): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return "";
    return date.toISOString();
  } catch {
    return "";
  }
};

const extractPopulationCoverage = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string => graph.getLiteral(datasetSubject, HEALTHDCATAP_POPULATION_COVERAGE);

const extractSpatialResolutionInMeters = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): number | undefined => {
  const literal = graph.getLiteral(
    datasetSubject,
    DCAT_SPATIAL_RESOLUTION_IN_METERS
  );
  if (!literal) return undefined;
  const parsed = Number.parseFloat(literal);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const extractSpatialCoverage = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): number | undefined => {
  const extractedField = graph.getLiteral(
    datasetSubject,
    DCAT_SPATIAL_COVERAGE
  );
  if (!extractedField) return undefined;
  const spatialCoverage = Number.parseFloat(extractedField);
  return Number.isNaN(spatialCoverage) ? undefined : spatialCoverage;
};
