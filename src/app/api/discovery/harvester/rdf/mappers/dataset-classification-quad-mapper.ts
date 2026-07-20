// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addConcept,
  createLanguageLiteral,
  createLiteral,
  createNamedNode,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

export const addDatasetClassificationQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  dataset.themes?.forEach((theme) =>
    addConcept(store, datasetNode, ns.dcat("theme"), theme.value, theme.label)
  );
  dataset.keywords?.forEach((keyword) =>
    store.add(datasetNode, ns.dcat("keyword"), createLiteral(keyword))
  );
  dataset.healthTheme?.forEach((theme) =>
    addConcept(
      store,
      datasetNode,
      ns.health("healthTheme"),
      theme.value,
      theme.label
    )
  );
  dataset.healthCategory?.forEach((category) =>
    addConcept(
      store,
      datasetNode,
      ns.health("healthCategory"),
      category.value,
      category.label
    )
  );
  dataset.dcatType?.forEach((typeItem) =>
    addConcept(
      store,
      datasetNode,
      ns.dct("type"),
      typeItem.value,
      typeItem.label
    )
  );
  if (dataset.accessRights) {
    const { value, label } = dataset.accessRights;
    if (value) {
      const rightsNode = createNamedNode(value);
      store.add(datasetNode, ns.dct("accessRights"), rightsNode);
      store.add(rightsNode, ns.rdf("type"), ns.dct("RightsStatement"));
      if (label) {
        store.add(
          rightsNode,
          ns.skos("prefLabel"),
          createLanguageLiteral(label, "eng")
        );
      }
    }
  }
  dataset.conformsTo?.forEach((entry) =>
    addConcept(
      store,
      datasetNode,
      ns.dct("conformsTo"),
      entry.value,
      entry.label
    )
  );
};
