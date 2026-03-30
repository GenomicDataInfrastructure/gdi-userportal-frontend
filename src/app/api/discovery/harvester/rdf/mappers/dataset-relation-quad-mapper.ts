// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  createLiteral,
  createNamedNode,
  isAbsoluteUri,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

const RELATION_LABEL_TO_PREDICATE: Record<
  string,
  { namespace: "dct" | "dcat"; localName: string }
> = {
  "Is part of": { namespace: "dct", localName: "isPartOf" },
  "Has part": { namespace: "dct", localName: "hasPart" },
  "Is version of": { namespace: "dct", localName: "isVersionOf" },
  "Has version": { namespace: "dct", localName: "hasVersion" },
  Replaces: { namespace: "dct", localName: "replaces" },
  "Is replaced by": { namespace: "dct", localName: "isReplacedBy" },
  Requires: { namespace: "dct", localName: "requires" },
  "Is required by": { namespace: "dct", localName: "isRequiredBy" },
  References: { namespace: "dct", localName: "references" },
  "Is referenced by": { namespace: "dct", localName: "isReferencedBy" },
  Source: { namespace: "dct", localName: "source" },
  "In series": { namespace: "dcat", localName: "inSeries" },
  "Related to": { namespace: "dct", localName: "relation" },
};

export const addDatasetRelationQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  dataset.datasetRelationships?.forEach((relation) => {
    const mapping = RELATION_LABEL_TO_PREDICATE[relation.relation];
    if (!mapping) {
      return;
    }

    const predicate = ns[mapping.namespace](mapping.localName);
    const object = isAbsoluteUri(relation.target)
      ? createNamedNode(relation.target)
      : createLiteral(relation.target);

    store.add(datasetNode, predicate, object);
  });
};
