// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addLiteral,
  addNamedNode,
  createDateTimeLiteral,
  createLanguageLiteral,
  createLiteral,
  createNamedNode,
  createNestedNode,
  isAbsoluteUri,
  isNonEmptyString,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

export const addDatasetCoreQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  store.add(datasetNode, ns.rdf("type"), ns.dcat("Dataset"));
  addLiteral(store, datasetNode, ns.dct("identifier"), dataset.identifier);
  addLiteral(store, datasetNode, ns.dct("title"), dataset.title);
  addLiteral(store, datasetNode, ns.dct("description"), dataset.description);
  addNamedNode(store, datasetNode, ns.dcat("inCatalog"), dataset.catalogue);

  dataset.languages?.forEach(({ value, label }) => {
    if (!isNonEmptyString(value)) {
      return;
    }

    if (isAbsoluteUri(value)) {
      const langNode = createNamedNode(value);
      store.add(datasetNode, ns.dct("language"), langNode);
      store.add(langNode, ns.rdf("type"), ns.dct("LinguisticSystem"));
      if (isNonEmptyString(label)) {
        store.add(
          langNode,
          ns.skos("prefLabel"),
          createLanguageLiteral(label, "eng")
        );
      }
      return;
    }

    store.add(datasetNode, ns.dct("language"), createLiteral(value));
  });

  if (isNonEmptyString(dataset.createdAt)) {
    store.add(
      datasetNode,
      ns.dct("issued"),
      createDateTimeLiteral(dataset.createdAt)
    );
  }
  if (isNonEmptyString(dataset.modifiedAt)) {
    store.add(
      datasetNode,
      ns.dct("modified"),
      createDateTimeLiteral(dataset.modifiedAt)
    );
  }

  addLiteral(store, datasetNode, ns.dcat("version"), dataset.version);

  dataset.hasVersions?.forEach((version, index) => {
    const versionNode = isAbsoluteUri(version.value)
      ? createNamedNode(version.value)
      : createNestedNode(
          { dataset, store, datasetNode },
          `version-${index + 1}`
        );

    store.add(datasetNode, ns.dcat("hasVersion"), versionNode);
    store.add(versionNode, ns.rdf("type"), ns.dcat("Dataset"));
    addLiteral(store, versionNode, ns.dct("identifier"), version.value);
    addLiteral(store, versionNode, ns.dct("title"), version.label);
  });

  dataset.versionNotes?.forEach((note) =>
    store.add(datasetNode, ns.adms("versionNotes"), createLiteral(note))
  );
};
