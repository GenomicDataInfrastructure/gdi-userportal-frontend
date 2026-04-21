// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addConcept,
  addLiteral,
  addNamedNode,
  createLiteral,
  createNamedNode,
  createNestedNode,
  isAbsoluteUri,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";
import { DATASET_EXPORT_PREFIXES } from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";

export const addDatasetDistributionQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  dataset.distributions?.forEach((distribution, index) => {
    const distributionNode = isAbsoluteUri(distribution.id)
      ? createNamedNode(distribution.id)
      : createNestedNode(
          { dataset, store, datasetNode },
          `distribution-${index + 1}`
        );

    store.add(datasetNode, ns.dcat("distribution"), distributionNode);
    store.add(distributionNode, ns.rdf("type"), ns.dcat("Distribution"));
    addLiteral(store, distributionNode, ns.dct("identifier"), distribution.id);
    addLiteral(store, distributionNode, ns.dct("title"), distribution.title);

    if (distribution.format) {
      addConcept(
        store,
        distributionNode,
        ns.dct("format"),
        distribution.format.value,
        distribution.format.label
      );
    }

    if (distribution.mediaType) {
      addConcept(
        store,
        distributionNode,
        ns.dcat("mediaType"),
        distribution.mediaType.value,
        distribution.mediaType.label
      );
    }

    if (distribution.license) {
      addConcept(
        store,
        distributionNode,
        ns.dct("license"),
        distribution.license.value,
        distribution.license.label
      );
    }

    distribution.conformsTo?.forEach((entry) =>
      addNamedNode(store, distributionNode, ns.dct("conformsTo"), entry.value)
    );

    if (distribution.byteSize !== undefined) {
      store.add(
        distributionNode,
        ns.dcat("byteSize"),
        createLiteral(
          String(distribution.byteSize),
          `${DATASET_EXPORT_PREFIXES.xsd}nonNegativeInteger`
        )
      );
    }

    addNamedNode(
      store,
      distributionNode,
      ns.dcat("accessURL"),
      distribution.accessUrl
    );
    addNamedNode(
      store,
      distributionNode,
      ns.dcat("downloadURL"),
      distribution.downloadUrl
    );
  });
};
