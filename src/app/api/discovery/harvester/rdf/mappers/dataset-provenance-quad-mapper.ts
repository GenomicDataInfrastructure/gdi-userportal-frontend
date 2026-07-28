// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  createBlankNode,
  createNamedNode,
  isAbsoluteUri,
  isNonEmptyString,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

export const addDatasetProvenanceActivityQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  if (!dataset.wasGeneratedBy?.length) {
    return;
  }

  dataset.wasGeneratedBy.forEach((activity) => {
    // Use a blank node so rdflib renders it inline as
    // <prov:Activity rdf:nodeID="..."> rather than a separate top-level block.
    const activityNode = createBlankNode();
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
