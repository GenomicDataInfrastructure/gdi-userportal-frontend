// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addConcept,
  createLiteral,
  createNamedNode,
  createNestedNode,
  isAbsoluteUri,
  isNonEmptyString,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

export const addDatasetGovernanceQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  if (dataset.frequency) {
    addConcept(
      store,
      datasetNode,
      ns.dct("accrualPeriodicity"),
      dataset.frequency.value,
      dataset.frequency.label
    );
  }

  dataset.legalBasis?.forEach((entry, index) => {
    if (!isNonEmptyString(entry.value)) {
      return;
    }
    const legalBasisNode = isAbsoluteUri(entry.value)
      ? createNamedNode(entry.value)
      : createNestedNode(
          { dataset, store, datasetNode },
          `legal-basis-${index + 1}`
        );
    store.add(datasetNode, ns.dpv("hasLegalBasis"), legalBasisNode);
    store.add(legalBasisNode, ns.rdf("type"), ns.dpv("LegalBasis"));
    store.add(
      legalBasisNode,
      ns.dct("description"),
      createLiteral(entry.label || entry.value)
    );
  });

  dataset.applicableLegislation?.forEach((entry) =>
    addConcept(
      store,
      datasetNode,
      ns.dcatap("applicableLegislation"),
      entry.value,
      entry.label
    )
  );
};
