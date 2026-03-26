// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalDatasetDictionaryEntry } from "@/app/api/discovery/local-store/types";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

const DCT_DESCRIPTION = "http://purl.org/dc/terms/description"; // NOSONAR
const DC_DESCRIPTION = "http://purl.org/dc/elements/1.1/description"; // NOSONAR
const RDFS_LABEL = "http://www.w3.org/2000/01/rdf-schema#label"; // NOSONAR
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"; // NOSONAR

const CSVW_COLUMN = "http://www.w3.org/ns/csvw#Column"; // NOSONAR
const CSVW_TABLE = "http://www.w3.org/ns/csvw#table"; // NOSONAR
const CSVW_TABLE_GROUP = "http://www.w3.org/ns/csvw#TableGroup"; // NOSONAR
const CSVW_TABLE_COLUMN = "http://www.w3.org/ns/csvw#column"; // NOSONAR
const CSVW_NAME = "http://www.w3.org/ns/csvw#name"; // NOSONAR
const CSVW_DATATYPE = "http://www.w3.org/ns/csvw#datatype"; // NOSONAR

const FOAF_NAME = "http://xmlns.com/foaf/0.1/name"; // NOSONAR
const FOAF_PAGE = "http://xmlns.com/foaf/0.1/page"; // NOSONAR

export const extractDataDictionary = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): LocalDatasetDictionaryEntry[] | undefined => {
  const entries = graph
    .getObjects(datasetSubject, FOAF_PAGE)
    .flatMap((pageSubject) => getCsvwColumnSubjects(pageSubject, graph))
    .map((entrySubject) => {
      const name =
        graph.getLiteral(entrySubject, CSVW_NAME) ||
        graph.getLiteral(entrySubject, FOAF_NAME) ||
        graph.getNamedNodeValue(entrySubject).split("/").pop() ||
        "";

      const datatypeObject = graph.getObjects(entrySubject, CSVW_DATATYPE)[0];
      const type = datatypeObject
        ? resolveDataDictionaryType(datatypeObject, graph)
        : "";

      const description =
        graph.getLiteral(entrySubject, DCT_DESCRIPTION) ||
        graph.getLiteral(entrySubject, RDFS_LABEL) ||
        graph.getFirstLiteral(entrySubject, [DCT_DESCRIPTION, DC_DESCRIPTION]);

      if (!name || !type || !description) {
        return null;
      }

      return {
        name,
        type,
        description,
      };
    })
    .filter((entry): entry is LocalDatasetDictionaryEntry => entry !== null);

  return entries.length > 0 ? entries : undefined;
};

const getCsvwColumnSubjects = (
  pageSubject: RDF.Term,
  graph: RdfGraph
): RDF.Term[] => {
  const isTableGroup = graph
    .getObjects(pageSubject, RDF_TYPE)
    .some(
      (typeTerm) =>
        typeTerm.termType === "NamedNode" && typeTerm.value === CSVW_TABLE_GROUP
    );

  if (!isTableGroup) {
    return [];
  }

  return graph
    .getObjects(pageSubject, CSVW_TABLE)
    .flatMap((tableSubject) =>
      graph.getObjects(tableSubject, CSVW_TABLE_COLUMN)
    )
    .filter((columnSubject) =>
      graph
        .getObjects(columnSubject, RDF_TYPE)
        .some(
          (typeTerm) =>
            typeTerm.termType === "NamedNode" && typeTerm.value === CSVW_COLUMN
        )
    );
};

const resolveDataDictionaryType = (
  datatypeObject: RDF.Term,
  graph: RdfGraph
): string => {
  if (datatypeObject.termType === "Literal") {
    return datatypeObject.value.trim();
  }

  if (datatypeObject.termType === "NamedNode") {
    return (
      datatypeObject.value.split("#").pop()?.trim() ||
      datatypeObject.value.split("/").pop()?.trim() ||
      datatypeObject.value.trim()
    );
  }

  return (
    graph.getLiteral(datatypeObject, RDFS_LABEL) ||
    graph.getNamedNodeValue(datatypeObject).split("#").pop()?.trim() ||
    graph.getNamedNodeValue(datatypeObject).split("/").pop()?.trim() ||
    datatypeObject.value.trim()
  );
};
