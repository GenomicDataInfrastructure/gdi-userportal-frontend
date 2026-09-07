// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addLiteral,
  createLanguageLiteral,
  createNestedNode,
  isNonEmptyString,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

const toDictionaryDatatypeLiteral = (value: string): string =>
  value.split(/[/#]/).findLast(Boolean) || value;

const toDictionaryColumnTitle = (value: string): string =>
  value
    .trim()
    .replaceAll(/[_-]+/g, " ")
    .replaceAll(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export const addDatasetDictionaryQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  if (!dataset.dataDictionary?.length) {
    return;
  }

  const tableGroupNode = createNestedNode(
    { dataset, store, datasetNode },
    "data-dictionary"
  );
  const tableNode = createNestedNode(
    { dataset, store, datasetNode },
    "data-dictionary-table"
  );
  store.add(datasetNode, ns.health("hasVariables"), tableGroupNode);
  store.add(tableGroupNode, ns.rdf("type"), ns.csvw("TableGroup"));
  store.add(tableGroupNode, ns.csvw("table"), tableNode);
  store.add(tableNode, ns.rdf("type"), ns.csvw("Table"));
  store.add(
    tableNode,
    ns.dct("title"),
    createLanguageLiteral("Data Dictionary Table", "en")
  );

  dataset.dataDictionary.forEach((entry, index) => {
    if (
      !isNonEmptyString(entry.name) ||
      !isNonEmptyString(entry.type) ||
      !isNonEmptyString(entry.description)
    ) {
      return;
    }

    const columnNode = createNestedNode(
      { dataset, store, datasetNode },
      `data-dictionary-column-${index + 1}`
    );
    store.add(tableNode, ns.csvw("column"), columnNode);
    store.add(columnNode, ns.rdf("type"), ns.csvw("Column"));
    addLiteral(store, columnNode, ns.csvw("name"), entry.name);
    store.add(
      columnNode,
      ns.csvw("titles"),
      createLanguageLiteral(toDictionaryColumnTitle(entry.name), "en")
    );
    addLiteral(
      store,
      columnNode,
      ns.csvw("datatype"),
      toDictionaryDatatypeLiteral(entry.type)
    );
    addLiteral(store, columnNode, ns.dct("description"), entry.description);
  });
};
