// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  createNamedNode,
  createNestedNode,
  isAbsoluteUri,
  isNonEmptyString,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

export const addDatasetProvenanceActivityQuads = (
  context: DatasetRdfContext
): void => {
  const { dataset, store, datasetNode } = context;
  if (!dataset.wasGeneratedBy?.length) {
    return;
  }

  dataset.wasGeneratedBy.forEach((activity, index) => {
    // Named resources preserve rdf:type when rdflib's RDF/XML is parsed again.
    const activityNode = createNestedNode(context, `activity-${index + 1}`);
    store.add(datasetNode, ns.prov("wasGeneratedBy"), activityNode);
    store.add(activityNode, ns.rdf("type"), ns.prov("Activity"));

    if (
      isNonEmptyString(activity.activityType) &&
      isAbsoluteUri(activity.activityType!)
    ) {
      store.add(
        activityNode,
        ns.dct("type"),
        createNamedNode(activity.activityType!)
      );
    }
  });
};
