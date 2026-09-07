// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalDatasetDictionaryEntry } from "@/app/api/discovery/local-store/types";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

const DCT_DESCRIPTION = "http://purl.org/dc/terms/description"; // NOSONAR
const DC_DESCRIPTION = "http://purl.org/dc/elements/1.1/description"; // NOSONAR
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"; // NOSONAR
const HEALTHDCATAP_HAS_VARIABLES =
  "http://healthdataportal.eu/ns/health#hasVariables"; // NOSONAR
const CSVW_TABLE_GROUP = "http://www.w3.org/ns/csvw#TableGroup"; // NOSONAR
const CSVW_TABLE = "http://www.w3.org/ns/csvw#Table"; // NOSONAR
const CSVW_TABLE_PROPERTY = "http://www.w3.org/ns/csvw#table"; // NOSONAR
const CSVW_COLUMN = "http://www.w3.org/ns/csvw#column"; // NOSONAR
const CSVW_NAME = "http://www.w3.org/ns/csvw#name"; // NOSONAR
const CSVW_DATATYPE = "http://www.w3.org/ns/csvw#datatype"; // NOSONAR

export const extractDataDictionary = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): LocalDatasetDictionaryEntry[] | undefined => {
  const result = getHealthDcatDictionaryColumns(datasetSubject, graph)
    .map((columnSubject) => mapDictionaryEntry(columnSubject, graph))
    .filter(
      (entry): entry is LocalDatasetDictionaryEntry => entry !== undefined
    );

  return result.length > 0 ? result : undefined;
};

const getHealthDcatDictionaryColumns = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): RDF.Term[] =>
  graph
    .getObjects(datasetSubject, HEALTHDCATAP_HAS_VARIABLES)
    .filter((groupSubject) => hasType(groupSubject, CSVW_TABLE_GROUP, graph))
    .flatMap((groupSubject) =>
      graph.getObjects(groupSubject, CSVW_TABLE_PROPERTY)
    )
    .filter((tableSubject) => hasType(tableSubject, CSVW_TABLE, graph))
    .flatMap((tableSubject) => graph.getObjects(tableSubject, CSVW_COLUMN));

const hasType = (subject: RDF.Term, type: string, graph: RdfGraph): boolean =>
  graph
    .getObjects(subject, RDF_TYPE)
    .some((object) => graph.getNamedNodeValue(object) === type);

const mapDictionaryEntry = (
  columnSubject: RDF.Term,
  graph: RdfGraph
): LocalDatasetDictionaryEntry | undefined => {
  const name = graph.getLiteral(columnSubject, CSVW_NAME);
  const type = extractColumnDatatype(columnSubject, graph);
  const description = graph.getFirstLiteral(columnSubject, [
    DCT_DESCRIPTION,
    DC_DESCRIPTION,
  ]);

  if (!name || !type || !description) {
    return undefined;
  }

  return { name, type, description };
};

const extractColumnDatatype = (
  columnSubject: RDF.Term,
  graph: RdfGraph
): string => {
  const datatype = graph.getObjects(columnSubject, CSVW_DATATYPE)[0];
  if (!datatype) {
    return "";
  }

  const value = graph.getNamedNodeValue(datatype) || datatype.value.trim();
  if (!value) {
    return "";
  }

  return value.split(/[/#]/).findLast(Boolean) || value;
};
