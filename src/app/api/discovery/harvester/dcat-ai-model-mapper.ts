// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalDiscoveryAiModel } from "@/app/api/discovery/local-store/types";
import { extractContactPoints } from "@/app/api/discovery/harvester/dcat-contact-point-mapper";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";
import { normalizeDate } from "@/app/api/discovery/harvester/date-utils";
import { isAbsoluteUri } from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";
import {
  DCAT_HAS_VERSION,
  DCAT_KEYWORD,
  DCAT_VERSION,
  DCT_CONFORMS_TO,
  DCT_CREATOR,
  DCT_ISSUED,
  DCT_MODIFIED,
  DCT_PUBLISHER,
  DCT_TYPE,
  extractAccessRights,
  extractAgents,
  extractDocumentation,
  extractVersionNotes,
  getDatasetDescription,
  getDatasetIdentifier,
  getDatasetTitle,
  getEntityId,
  resolveValueLabels,
} from "@/app/api/discovery/harvester/dcat-dataset-mapper";

// AI Models are harvested as a distinct RDF type (dcat:Resource)
export const DCAT_RESOURCE = "http://www.w3.org/ns/dcat#Resource";

/**
 * Maps an AI Model RDF record using only the fields it shares with Dataset,
 * reusing Dataset's own extraction helpers. Libraries and Tasks are
 * AI-Model-only: both are serialized through predicates Dataset already uses
 * for different fields (dct:conformsTo, dct:type), so they are read here
 * rather than shared.
 */
export const mapAiModel = (
  aiModelSubject: RDF.Term,
  graph: RdfGraph,
  index: number
): LocalDiscoveryAiModel => {
  const identifier = getDatasetIdentifier(aiModelSubject, graph);

  return {
    id: getEntityId(aiModelSubject, identifier, graph, index, "ai-model"),
    identifier,
    entityType: "AI_MODEL",
    title: getDatasetTitle(aiModelSubject, graph),
    description: getDatasetDescription(aiModelSubject, graph),
    createdAt: normalizeDate(graph.getLiteral(aiModelSubject, DCT_ISSUED)),
    modifiedAt: normalizeDate(graph.getLiteral(aiModelSubject, DCT_MODIFIED)),
    version: graph.getLiteral(aiModelSubject, DCAT_VERSION),
    hasVersions: resolveValueLabels(
      graph.getObjects(aiModelSubject, DCAT_HAS_VERSION),
      graph
    ),
    versionNotes: extractVersionNotes(aiModelSubject, graph)?.join("\n"),
    accessRights: extractAccessRights(aiModelSubject, graph),
    keywords: graph.getObjectValues(aiModelSubject, DCAT_KEYWORD),
    documentation: extractDocumentation(aiModelSubject, graph),
    contacts: extractContactPoints(aiModelSubject, graph),
    publishers: extractAgents(aiModelSubject, graph, DCT_PUBLISHER),
    creators: extractAgents(aiModelSubject, graph, DCT_CREATOR),
    libraries: extractLabels(aiModelSubject, graph, DCT_CONFORMS_TO),
    tasks: extractLabels(aiModelSubject, graph, DCT_TYPE),
    libraryResources: extractResourceLabels(
      aiModelSubject,
      graph,
      DCT_CONFORMS_TO
    ),
    taskResources: extractResourceLabels(aiModelSubject, graph, DCT_TYPE),
  };
};

const extractResourceLabels = (
  subject: RDF.Term,
  graph: RdfGraph,
  predicate: string
): Array<{ value: string; label: string }> | undefined => {
  const values = resolveValueLabels(
    graph.getObjects(subject, predicate),
    graph
  ).filter(({ value }) => isAbsoluteUri(value));
  return values.length ? values : undefined;
};

const extractLabels = (
  subject: RDF.Term,
  graph: RdfGraph,
  predicate: string
): string[] | undefined => {
  const values = resolveValueLabels(
    graph.getObjects(subject, predicate),
    graph
  ).map(({ label }) => label);
  return values.length > 0 ? values : undefined;
};
