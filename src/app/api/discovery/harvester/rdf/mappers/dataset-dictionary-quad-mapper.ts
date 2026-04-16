// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DATASET_EXPORT_PREFIXES,
  DatasetRdfContext,
  addLiteral,
  createBlankNode,
  createNamedNode,
  isAbsoluteUri,
  isNonEmptyString,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

const toDictionaryDatatypeNode = (value: string) =>
  createNamedNode(
    isAbsoluteUri(value) ? value : `${DATASET_EXPORT_PREFIXES.xsd}${value}`
  );

export const addDatasetDictionaryQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  if (!dataset.dataDictionary?.length) {
    return;
  }

  const schemaNode = createBlankNode();
  store.add(datasetNode, ns.foaf("page"), schemaNode);
  store.add(schemaNode, ns.rdf("type"), ns.foaf("Document"));
  store.add(schemaNode, ns.rdf("type"), ns.csvw("TableSchema"));

  dataset.dataDictionary.forEach((entry) => {
    if (
      !isNonEmptyString(entry.name) ||
      !isNonEmptyString(entry.type) ||
      !isNonEmptyString(entry.description)
    ) {
      return;
    }

    const columnNode = createBlankNode();
    store.add(schemaNode, ns.csvw("column"), columnNode);
    store.add(columnNode, ns.rdf("type"), ns.csvw("Column"));
    addLiteral(store, columnNode, ns.csvw("name"), entry.name);
    store.add(
      columnNode,
      ns.csvw("datatype"),
      toDictionaryDatatypeNode(entry.type)
    );
    addLiteral(store, columnNode, ns.dct("description"), entry.description);
  });
};
