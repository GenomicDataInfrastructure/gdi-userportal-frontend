// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import {
  LocalAgent,
  LocalDiscoveryDataset,
  SpatialCoverage,
} from "@/app/api/discovery/local-store/types";
import { extractContactPoints } from "@/app/api/discovery/harvester/dcat-contact-point-mapper";
import { extractDatasetRelations } from "@/app/api/discovery/harvester/dcat-dataset-relation-mapper";
import { extractDistributions } from "@/app/api/discovery/harvester/dcat-distribution-mapper";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";
import { normalizeDate } from "@/app/api/discovery/harvester/date-utils";

export const DCAT_DATASET = "http://www.w3.org/ns/dcat#Dataset";
export const DCAT_CATALOG = "http://www.w3.org/ns/dcat#Catalog";

// NOSONAR: These are RDF vocabulary URIs (identifiers, not network endpoints) and must use http as defined by their specifications.
const DCAT_IN_CATALOG = "http://www.w3.org/ns/dcat#inCatalog"; // NOSONAR
const DCT_IDENTIFIER = "http://purl.org/dc/terms/identifier"; // NOSONAR
const DCT_TITLE = "http://purl.org/dc/terms/title"; // NOSONAR
const DC_TITLE = "http://purl.org/dc/elements/1.1/title"; // NOSONAR
const DCT_DESCRIPTION = "http://purl.org/dc/terms/description"; // NOSONAR
const DC_DESCRIPTION = "http://purl.org/dc/elements/1.1/description"; // NOSONAR
const DCT_PROVENANCE = "http://purl.org/dc/terms/provenance"; // NOSONAR
const DCT_LANGUAGE = "http://purl.org/dc/terms/language"; // NOSONAR
const DCT_ISSUED = "http://purl.org/dc/terms/issued"; // NOSONAR
const DCT_MODIFIED = "http://purl.org/dc/terms/modified"; // NOSONAR
const DCAT_VERSION = "http://www.w3.org/ns/dcat#version"; // NOSONAR
const DCAT_HAS_VERSION = "http://www.w3.org/ns/dcat#hasVersion"; // NOSONAR
const ADMS_VERSION_NOTES = "http://www.w3.org/ns/adms#versionNotes"; // NOSONAR
const DCT_SPATIAL = "http://purl.org/dc/terms/spatial"; // NOSONAR
const SKOS_PREF_LABEL = "http://www.w3.org/2004/02/skos/core#prefLabel"; // NOSONAR
const RDFS_LABEL = "http://www.w3.org/2000/01/rdf-schema#label"; // NOSONAR
const HEALTHDCATAP_NUMBER_OF_RECORDS =
  "http://healthdataportal.eu/ns/health#numberOfRecords"; // NOSONAR
const HEALTHDCATAP_NUMBER_OF_UNIQUE_INDIVIDUALS =
  "http://healthdataportal.eu/ns/health#numberOfUniqueIndividuals"; // NOSONAR
const HEALTHDCATAP_MAX_TYPICAL_AGE =
  "http://healthdataportal.eu/ns/health#maxTypicalAge"; // NOSONAR
const HEALTHDCATAP_MIN_TYPICAL_AGE =
  "http://healthdataportal.eu/ns/health#minTypicalAge"; // NOSONAR
const HEALTHDCATAP_POPULATION_COVERAGE =
  "http://healthdataportal.eu/ns/health#populationCoverage"; // NOSONAR
const DCAT_SPATIAL_RESOLUTION_IN_METERS =
  "http://www.w3.org/ns/dcat#spatialResolutionInMeters"; // NOSONAR
const DCT_TEMPORAL = "http://purl.org/dc/terms/temporal"; // NOSONAR
const HEALTHDCATAP_RETENTION_PERIOD =
  "http://healthdataportal.eu/ns/health#retentionPeriod"; // NOSONAR
const DCAT_START_DATE = "http://www.w3.org/ns/dcat#startDate"; // NOSONAR
const DCAT_END_DATE = "http://www.w3.org/ns/dcat#endDate"; // NOSONAR
const DCAT_TEMPORAL_RESOLUTION = "http://www.w3.org/ns/dcat#temporalResolution"; // NOSONAR
const DCT_ACCRUAL_PERIODICITY = "http://purl.org/dc/terms/accrualPeriodicity"; // NOSONAR
const DCAT_THEME = "http://www.w3.org/ns/dcat#theme"; // NOSONAR
const DCAT_KEYWORD = "http://www.w3.org/ns/dcat#keyword"; // NOSONAR
const HEALTHDCATAP_HEALTH_THEME =
  "http://healthdataportal.eu/ns/health#healthTheme"; // NOSONAR
const HEALTHDCATAP_HEALTH_CATEGORY =
  "http://healthdataportal.eu/ns/health#healthCategory"; // NOSONAR
const DCT_TYPE = "http://purl.org/dc/terms/type"; // NOSONAR
const DCT_ACCESS_RIGHTS = "http://purl.org/dc/terms/accessRights"; // NOSONAR
const DPV_HAS_LEGAL_BASIS = "http://www.w3.org/ns/dpv#hasLegalBasis"; // NOSONAR
const DPV_HAS_PURPOSE = "http://www.w3.org/ns/dpv#hasPurpose"; // NOSONAR
const DPV_HAS_PERSONAL_DATA = "http://www.w3.org/ns/dpv#hasPersonalData"; // NOSONAR
const DCATAP_APPLICABLE_LEGISLATION =
  "http://data.europa.eu/r5r/applicableLegislation"; // NOSONAR
const DCT_PUBLISHER = "http://purl.org/dc/terms/publisher"; // NOSONAR
const DCT_CREATOR = "http://purl.org/dc/terms/creator"; // NOSONAR
const FOAF_NAME = "http://xmlns.com/foaf/0.1/name"; // NOSONAR
const FOAF_MBOX = "http://xmlns.com/foaf/0.1/mbox"; // NOSONAR
const FOAF_HOMEPAGE = "http://xmlns.com/foaf/0.1/homepage"; // NOSONAR
const FOAF_URL = "http://xmlns.com/foaf/0.1/workInfoHomepage"; // NOSONAR
const HEALTHDCATAP_HDAB = "http://healthdataportal.eu/ns/health#hdab"; // NOSONAR
const HEALTHDCATAP_HAS_CODE_VALUES =
  "http://healthdataportal.eu/ns/health#hasCodeValues"; // NOSONAR
const HEALTHDCATAP_HAS_CODING_SYSTEM =
  "http://healthdataportal.eu/ns/health#hasCodingSystem"; // NOSONAR
const DCT_IS_REFERENCED_BY = "http://purl.org/dc/terms/isReferencedBy"; // NOSONAR
const FOAF_PAGE = "http://xmlns.com/foaf/0.1/page"; // NOSONAR

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
  const publishers = extractAgents(datasetSubject, graph, DCT_PUBLISHER);
  const publisherTypes = publishers
    .map((p) => p.type)
    .filter((t): t is { value: string; label: string } => t !== undefined);
  const datasetId = getDatasetId(datasetSubject, identifier, graph, index);

  return {
    id: datasetId,
    identifier,
    title: getDatasetTitle(datasetSubject, graph),
    description: getDatasetDescription(datasetSubject, graph),
    catalogue: getDatasetCatalogue(datasetSubject, graph, fallbackCatalogue),
    languages: getDatasetLanguages(datasetSubject, graph),
    createdAt: normalizeDate(graph.getLiteral(datasetSubject, DCT_ISSUED)),
    modifiedAt: normalizeDate(graph.getLiteral(datasetSubject, DCT_MODIFIED)),
    version: graph.getLiteral(datasetSubject, DCAT_VERSION),
    hasVersions: resolveValueLabels(
      graph.getObjects(datasetSubject, DCAT_HAS_VERSION),
      graph
    ),
    versionNotes: extractVersionNotes(datasetSubject, graph),
    numberOfRecords: extractNumericLiteral(
      datasetSubject,
      graph,
      HEALTHDCATAP_NUMBER_OF_RECORDS
    ),
    numberOfUniqueIndividuals: extractNumericLiteral(
      datasetSubject,
      graph,
      HEALTHDCATAP_NUMBER_OF_UNIQUE_INDIVIDUALS
    ),
    maxTypicalAge: extractNumericLiteral(
      datasetSubject,
      graph,
      HEALTHDCATAP_MAX_TYPICAL_AGE
    ),
    minTypicalAge: extractNumericLiteral(
      datasetSubject,
      graph,
      HEALTHDCATAP_MIN_TYPICAL_AGE
    ),
    spatialCoverage: extractSpatialCoverage(datasetSubject, graph),
    populationCoverage: extractPopulationCoverage(datasetSubject, graph),
    spatialResolutionInMeters: extractSpatialResolutionInMeters(
      datasetSubject,
      graph
    ),
    temporalCoverage: extractPeriodOfTime(datasetSubject, graph, DCT_TEMPORAL),
    retentionPeriod: extractRetentionPeriod(datasetSubject, graph),
    temporalResolution:
      graph.getLiteral(datasetSubject, DCAT_TEMPORAL_RESOLUTION) || undefined,
    frequency: extractFrequency(datasetSubject, graph),
    accessRights: extractAccessRights(datasetSubject, graph),
    legalBasis: extractLegalBasis(datasetSubject, graph),
    applicableLegislation: extractApplicableLegislation(datasetSubject, graph),
    themes: resolveValueLabels(
      graph.getObjects(datasetSubject, DCAT_THEME),
      graph
    ),
    keywords: graph.getObjectValues(datasetSubject, DCAT_KEYWORD),
    provenance: extractProvenance(datasetSubject, graph),
    healthTheme: resolveValueLabels(
      graph.getObjects(datasetSubject, HEALTHDCATAP_HEALTH_THEME),
      graph
    ),
    healthCategory: resolveValueLabels(
      graph.getObjects(datasetSubject, HEALTHDCATAP_HEALTH_CATEGORY),
      graph
    ),
    dcatType: resolveValueLabels(
      graph.getObjects(datasetSubject, DCT_TYPE),
      graph
    ),
    contacts: extractContactPoints(datasetSubject, graph),
    datasetRelationships: extractDatasetRelations(datasetSubject, graph),
    distributions: extractDistributions(datasetSubject, graph, datasetId),
    publishers,
    publisherType: publisherTypes.length > 0 ? publisherTypes : undefined,
    hdab: extractAgents(datasetSubject, graph, HEALTHDCATAP_HDAB),
    creators: extractAgents(datasetSubject, graph, DCT_CREATOR),
    personalData: extractPersonalData(datasetSubject, graph),
    purpose: extractPurpose(datasetSubject, graph),
    codeValues: extractLiteralValueLabels(
      datasetSubject,
      graph,
      HEALTHDCATAP_HAS_CODE_VALUES
    ),
    codingSystem: extractNamedNodeValueLabels(
      datasetSubject,
      graph,
      HEALTHDCATAP_HAS_CODING_SYSTEM
    ),
    isReferencedBy: extractIsReferencedBy(datasetSubject, graph),
    documentation: extractDocumentation(datasetSubject, graph),
  };
};

const resolveValueLabels = (
  objects: RDF.Term[],
  graph: RdfGraph
): Array<{ value: string; label: string }> => {
  return objects
    .map((obj) => {
      const value = graph.getNamedNodeValue(obj) || obj.value.trim();
      if (!value) return null;
      const label =
        graph.getLiteral(obj, SKOS_PREF_LABEL) ||
        value.split("/").pop() ||
        value;
      return { value, label };
    })
    .filter((item): item is { value: string; label: string } => item !== null);
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

const extractNumericLiteral = (
  datasetSubject: RDF.Term,
  graph: RdfGraph,
  predicate: string
): number | undefined => {
  const value = graph.getLiteral(datasetSubject, predicate);
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const extractPopulationCoverage = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string => graph.getLiteral(datasetSubject, HEALTHDCATAP_POPULATION_COVERAGE);

const extractVersionNotes = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string[] | undefined => {
  const values = graph
    .getObjectValues(datasetSubject, ADMS_VERSION_NOTES)
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
};

const extractProvenance = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string | undefined => {
  for (const provenance of graph.getObjects(datasetSubject, DCT_PROVENANCE)) {
    if (provenance.termType === "Literal") {
      const literal = provenance.value.trim();
      if (literal) {
        return literal;
      }
      continue;
    }

    const label = graph.getFirstLiteral(provenance, [
      RDFS_LABEL,
      DCT_DESCRIPTION,
    ]);
    if (label) {
      return label;
    }
  }

  return undefined;
};

const extractSpatialResolutionInMeters = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): number[] | undefined => {
  const values: number[] = [];

  for (const value of graph.getObjectValues(
    datasetSubject,
    DCAT_SPATIAL_RESOLUTION_IN_METERS
  )) {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      values.push(parsed);
    }
  }

  return values.length > 0 ? values : undefined;
};

const extractSpatialCoverage = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): SpatialCoverage[] | undefined => {
  const locations = graph.getObjects(datasetSubject, DCT_SPATIAL);
  if (!locations.length) return undefined;
  return locations.map((location) => {
    const uri = graph.getNamedNodeValue(location) || undefined;
    const text = graph.getLiteral(location, SKOS_PREF_LABEL) || undefined;
    return { uri, text };
  });
};

const extractPeriodOfTime = (
  subject: RDF.Term,
  graph: RdfGraph,
  predicate: string
): { start?: string; end?: string } | undefined => {
  const periods = graph.getObjects(subject, predicate);
  if (!periods.length) return undefined;
  const period = periods[0];
  const start =
    normalizeDate(graph.getLiteral(period, DCAT_START_DATE)) || undefined;
  const end =
    normalizeDate(graph.getLiteral(period, DCAT_END_DATE)) || undefined;
  if (!start && !end) return undefined;
  return { start, end };
};

const extractRetentionPeriod = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): Array<{ start?: string; end?: string }> | undefined => {
  const periods = graph.getObjects(
    datasetSubject,
    HEALTHDCATAP_RETENTION_PERIOD
  );
  if (!periods.length) return undefined;
  const result = periods
    .map((period) => ({
      start:
        normalizeDate(graph.getLiteral(period, DCAT_START_DATE)) || undefined,
      end: normalizeDate(graph.getLiteral(period, DCAT_END_DATE)) || undefined,
    }))
    .filter((p) => p.start || p.end);
  return result.length > 0 ? result : undefined;
};

const extractFrequency = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): { value: string; label: string } | undefined => {
  const frequencies = graph.getObjects(datasetSubject, DCT_ACCRUAL_PERIODICITY);
  if (!frequencies.length) return undefined;
  const freq = frequencies[0];
  const value = graph.getNamedNodeValue(freq);
  if (!value) return undefined;
  const label =
    graph.getLiteral(freq, SKOS_PREF_LABEL) || value.split("/").pop() || value;
  return { value, label };
};

const extractAccessRights = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): { value: string; label: string } | undefined => {
  const objects = graph.getObjects(datasetSubject, DCT_ACCESS_RIGHTS);
  if (!objects.length) return undefined;
  const obj = objects[0];
  const value = graph.getNamedNodeValue(obj) || obj.value;
  if (!value) return undefined;
  const label =
    graph.getLiteral(obj, SKOS_PREF_LABEL) || value.split("/").pop() || value;
  return { value, label };
};

const extractLegalBasis = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): Array<{ value: string; label: string }> | undefined => {
  const objects = graph.getObjects(datasetSubject, DPV_HAS_LEGAL_BASIS);
  if (!objects.length) return undefined;
  const result = objects
    .map((obj) => {
      const label = graph.getLiteral(obj, DCT_DESCRIPTION);
      if (!label) return null;
      const value = graph.getNamedNodeValue(obj) || label;
      return { value, label };
    })
    .filter((item): item is { value: string; label: string } => item !== null);
  return result.length > 0 ? result : undefined;
};

const extractPurpose = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): Array<{ value: string; label: string }> | undefined => {
  const objects = graph.getObjects(datasetSubject, DPV_HAS_PURPOSE);
  if (!objects.length) return undefined;
  const result = objects
    .map((obj) => {
      const value = graph.getLiteral(obj, DCT_DESCRIPTION);
      if (!value) return null;
      return { value, label: value };
    })
    .filter((item): item is { value: string; label: string } => item !== null);
  return result.length > 0 ? result : undefined;
};

const extractApplicableLegislation = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): Array<{ value: string; label: string }> | undefined => {
  const objects = graph.getObjects(
    datasetSubject,
    DCATAP_APPLICABLE_LEGISLATION
  );
  if (!objects.length) return undefined;
  const result = objects
    .map((obj) => {
      const value = graph.getNamedNodeValue(obj) || obj.value;
      if (!value) return null;
      const label =
        graph.getFirstLiteral(obj, [SKOS_PREF_LABEL, RDFS_LABEL]) ||
        value.split("/").pop() ||
        value;
      return { value, label };
    })
    .filter((item): item is { value: string; label: string } => item !== null);
  return result.length > 0 ? result : undefined;
};

const extractPersonalData = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): Array<{ value: string; label: string }> | undefined => {
  const objects = graph.getObjects(datasetSubject, DPV_HAS_PERSONAL_DATA);
  if (!objects.length) return undefined;
  const result = objects
    .map((obj) => {
      const value = graph.getNamedNodeValue(obj) || obj.value;
      if (!value) return null;
      const label =
        graph.getFirstLiteral(obj, [SKOS_PREF_LABEL, RDFS_LABEL]) ||
        value.split(/[/#]/).findLast(Boolean) ||
        value;
      return { value, label };
    })
    .filter((item): item is { value: string; label: string } => item !== null);
  return result.length > 0 ? result : undefined;
};

const extractAgent = (
  agentSubject: RDF.Term,
  graph: RdfGraph
): LocalAgent | undefined => {
  const name = graph.getLiteral(agentSubject, FOAF_NAME);
  if (!name) return undefined;

  // foaf:mbox is typically a NamedNode like mailto:a@mail.com
  const mboxObjects = graph.getObjects(agentSubject, FOAF_MBOX);
  const rawMbox = mboxObjects[0]?.value?.trim() ?? "";
  const email = rawMbox.startsWith("mailto:")
    ? rawMbox.slice("mailto:".length)
    : rawMbox || undefined;

  // foaf:homepage is a NamedNode resource
  const homepageObjects = graph.getObjects(agentSubject, FOAF_HOMEPAGE);
  const homepage =
    homepageObjects.length > 0
      ? graph.getNamedNodeValue(homepageObjects[0]) || undefined
      : undefined;

  // foaf:workInfoHomepage as url fallback
  const urlObjects = graph.getObjects(agentSubject, FOAF_URL);
  const url =
    urlObjects.length > 0
      ? graph.getNamedNodeValue(urlObjects[0]) || undefined
      : undefined;

  const uri = graph.getNamedNodeValue(agentSubject) || undefined;

  const identifier =
    graph.getLiteral(agentSubject, DCT_IDENTIFIER) || undefined;

  // dct:type → skos:Concept with skos:prefLabel
  let type: { value: string; label: string } | undefined;
  const typeObjects = graph.getObjects(agentSubject, DCT_TYPE);
  if (typeObjects.length) {
    const typeSubject = typeObjects[0];
    const typeValue = graph.getNamedNodeValue(typeSubject);
    if (typeValue) {
      const typeLabel =
        graph.getLiteral(typeSubject, SKOS_PREF_LABEL) ||
        typeValue.split("/").pop() ||
        typeValue;
      type = { value: typeValue, label: typeLabel };
    }
  }

  return {
    name,
    ...(email && { email }),
    ...(url && { url }),
    ...(uri && { uri }),
    ...(homepage && { homepage }),
    ...(type && { type }),
    ...(identifier && { identifier }),
  };
};

const extractAgents = (
  subject: RDF.Term,
  graph: RdfGraph,
  predicate: string
): LocalAgent[] => {
  const objects = graph.getObjects(subject, predicate);
  return objects
    .map((obj) => extractAgent(obj, graph))
    .filter((a): a is LocalAgent => a !== undefined);
};

const extractLiteralValueLabels = (
  subject: RDF.Term,
  graph: RdfGraph,
  predicate: string
): Array<{ value: string; label: string }> | undefined => {
  const values = graph.getObjectValues(subject, predicate).filter(Boolean);
  if (!values.length) return undefined;
  return values.map((v) => ({ value: v, label: v }));
};

const extractNamedNodeValueLabels = (
  subject: RDF.Term,
  graph: RdfGraph,
  predicate: string
): Array<{ value: string; label: string }> | undefined => {
  const result = resolveValueLabels(
    graph.getObjects(subject, predicate),
    graph
  );
  return result.length > 0 ? result : undefined;
};

const extractIsReferencedBy = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string[] | undefined => {
  const objects = graph.getObjects(datasetSubject, DCT_IS_REFERENCED_BY);
  if (!objects.length) return undefined;
  const values = objects
    .map((obj) => graph.getNamedNodeValue(obj) || obj.value.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
};

const extractDocumentation = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): string[] | undefined => {
  const objects = graph.getObjects(datasetSubject, FOAF_PAGE);
  if (!objects.length) return undefined;
  const values = objects.map((obj) => obj.value);
  return values.length > 0 ? values : undefined;
};
