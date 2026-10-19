// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalDiscoveryAiModel } from "@/app/api/discovery/local-store/types";
import { extractContactPoints } from "@/app/api/discovery/harvester/dcat-contact-point-mapper";
import {
  ADMS_VERSION_NOTES,
  DC_DESCRIPTION,
  DC_TITLE,
  DCAT_HAS_VERSION,
  DCAT_KEYWORD,
  DCAT_VERSION,
  DCT_CREATOR,
  DCT_DESCRIPTION,
  DCT_IDENTIFIER,
  DCT_ISSUED,
  DCT_MODIFIED,
  DCT_PUBLISHER,
  DCT_TITLE,
  extractAccessRights,
  extractAgents,
  extractDocumentation,
  resolveValueLabels,
} from "@/app/api/discovery/harvester/dcat-dataset-mapper";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";
import { normalizeDate } from "@/app/api/discovery/harvester/date-utils";

// NOSONAR: This is an RDF vocabulary URI (identifier, not a network endpoint) and must use http as defined by its specification.
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"; // NOSONAR

export const AI_MODEL_RDF_TYPE_URI =
  "http://mindig_lu.gitlab.io/DCAT-AP-LU/vocab/cdsp/AIModel"; // NOSONAR

export const isAiModelSubject = (subject: RDF.Term, graph: RdfGraph): boolean =>
  graph
    .getObjects(subject, RDF_TYPE)
    .some((object) => object.value.trim() === AI_MODEL_RDF_TYPE_URI);

export const mapAiModel = (
  subject: RDF.Term,
  graph: RdfGraph,
  index: number
): LocalDiscoveryAiModel => {
  const identifier = getIdentifier(subject, graph);

  return {
    id: getId(subject, identifier, graph, index),
    identifier,
    entityType: "AI_MODEL",
    title: getFirstLiteral(subject, graph, [DCT_TITLE, DC_TITLE]),
    description: getFirstLiteral(subject, graph, [
      DCT_DESCRIPTION,
      DC_DESCRIPTION,
    ]),
    createdAt: normalizeDate(graph.getLiteral(subject, DCT_ISSUED)),
    modifiedAt: normalizeDate(graph.getLiteral(subject, DCT_MODIFIED)),
    version: graph.getLiteral(subject, DCAT_VERSION) || undefined,
    hasVersions: toUndefinedIfEmpty(
      resolveValueLabels(graph.getObjects(subject, DCAT_HAS_VERSION), graph)
    ),
    versionNotes: extractVersionNotes(subject, graph),
    accessRights: extractAccessRights(subject, graph),
    keywords: graph.getObjectValues(subject, DCAT_KEYWORD),
    documentation: extractDocumentation(subject, graph),
    contacts: extractContactPoints(subject, graph),
    publishers: extractAgents(subject, graph, DCT_PUBLISHER),
    creators: extractAgents(subject, graph, DCT_CREATOR),
  };
};

const getFirstLiteral = (
  subject: RDF.Term,
  graph: RdfGraph,
  predicates: string[]
): string => graph.getFirstLiteral(subject, predicates);

const getIdentifier = (subject: RDF.Term, graph: RdfGraph): string =>
  graph.getLiteral(subject, DCT_IDENTIFIER);

const getId = (
  subject: RDF.Term,
  identifier: string,
  graph: RdfGraph,
  index: number
): string => {
  if (identifier) return identifier;
  const subjectValue = graph.getNamedNodeValue(subject);
  if (subjectValue) return subjectValue;
  return `ai-model-${index + 1}`;
};

const toUndefinedIfEmpty = <T>(items: T[]): T[] | undefined =>
  items.length > 0 ? items : undefined;

const extractVersionNotes = (
  subject: RDF.Term,
  graph: RdfGraph
): string | undefined => {
  const values = graph
    .getObjectValues(subject, ADMS_VERSION_NOTES)
    .filter(Boolean);
  return values.length > 0 ? values.join("\n") : undefined;
};
