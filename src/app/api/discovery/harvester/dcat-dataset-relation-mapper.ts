// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

export interface LocalDatasetRelation {
  relation: string;
  target: string;
}

// NOSONAR: These are RDF vocabulary URIs (identifiers, not network endpoints)
const DCT_RELATION = "http://purl.org/dc/terms/relation"; // NOSONAR
const DCT_IS_PART_OF = "http://purl.org/dc/terms/isPartOf"; // NOSONAR
const DCT_HAS_PART = "http://purl.org/dc/terms/hasPart"; // NOSONAR
const DCT_IS_VERSION_OF = "http://purl.org/dc/terms/isVersionOf"; // NOSONAR
const DCT_HAS_VERSION = "http://purl.org/dc/terms/hasVersion"; // NOSONAR
const DCT_REPLACES = "http://purl.org/dc/terms/replaces"; // NOSONAR
const DCT_IS_REPLACED_BY = "http://purl.org/dc/terms/isReplacedBy"; // NOSONAR
const DCT_REQUIRES = "http://purl.org/dc/terms/requires"; // NOSONAR
const DCT_IS_REQUIRED_BY = "http://purl.org/dc/terms/isRequiredBy"; // NOSONAR
const DCT_REFERENCES = "http://purl.org/dc/terms/references"; // NOSONAR
const DCT_IS_REFERENCED_BY = "http://purl.org/dc/terms/isReferencedBy"; // NOSONAR
const DCT_SOURCE = "http://purl.org/dc/terms/source"; // NOSONAR
const DCAT_IN_SERIES = "http://www.w3.org/ns/dcat#inSeries"; // NOSONAR

const RELATION_PREDICATES: Array<{ predicate: string; label: string }> = [
  { predicate: DCT_IS_PART_OF, label: "Is part of" },
  { predicate: DCT_HAS_PART, label: "Has part" },
  { predicate: DCT_IS_VERSION_OF, label: "Is version of" },
  { predicate: DCT_HAS_VERSION, label: "Has version" },
  { predicate: DCT_REPLACES, label: "Replaces" },
  { predicate: DCT_IS_REPLACED_BY, label: "Is replaced by" },
  { predicate: DCT_REQUIRES, label: "Requires" },
  { predicate: DCT_IS_REQUIRED_BY, label: "Is required by" },
  { predicate: DCT_REFERENCES, label: "References" },
  { predicate: DCT_IS_REFERENCED_BY, label: "Is referenced by" },
  { predicate: DCT_SOURCE, label: "Source" },
  { predicate: DCAT_IN_SERIES, label: "In series" },
  { predicate: DCT_RELATION, label: "Related to" },
];

export const extractDatasetRelations = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): LocalDatasetRelation[] | undefined => {
  const relations: LocalDatasetRelation[] = [];

  for (const { predicate, label } of RELATION_PREDICATES) {
    const targets = graph.getObjects(datasetSubject, predicate);

    for (const target of targets) {
      const targetValue = extractTargetValue(target, graph);
      if (targetValue) {
        relations.push({
          relation: label,
          target: targetValue,
        });
      }
    }
  }

  return relations.length > 0 ? relations : undefined;
};

const extractTargetValue = (target: RDF.Term, graph: RdfGraph): string => {
  // If it's a NamedNode (URI reference), use its value
  const namedNodeValue = graph.getNamedNodeValue(target);
  if (namedNodeValue) {
    return namedNodeValue;
  }

  // If it's a literal, use its value directly
  if (target.termType === "Literal") {
    return target.value.trim();
  }

  // If it's a blank node, try to get dct:identifier
  const identifier = graph.getLiteral(
    target,
    "http://purl.org/dc/terms/identifier"
  );
  if (identifier) {
    return identifier;
  }

  // Fallback to the term's value
  return target.value.trim();
};
