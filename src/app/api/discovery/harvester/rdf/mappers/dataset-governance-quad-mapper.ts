// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addConcept,
  addNamedNode,
  createBlankNode,
  createLanguageLiteral,
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

  dataset.personalData?.forEach((entry) =>
    addNamedNode(store, datasetNode, ns.dpv("hasPersonalData"), entry.value)
  );

  dataset.purpose?.forEach((entry) => {
    if (!isNonEmptyString(entry.value)) return;
    const purposeNode = createBlankNode();
    store.add(datasetNode, ns.dpv("hasPurpose"), purposeNode);
    store.add(purposeNode, ns.rdf("type"), ns.dpv("Purpose"));
    store.add(
      purposeNode,
      ns.dct("description"),
      createLanguageLiteral(entry.value, "eng")
    );
  });
  dataset.codeValues?.forEach((entry) =>
    addNamedNode(store, datasetNode, ns.health("hasCodeValues"), entry.value)
  );

  dataset.codingSystem?.forEach((entry) => {
    if (!isNonEmptyString(entry.value) || !isAbsoluteUri(entry.value)) return;
    const standardNode = createNamedNode(entry.value);
    store.add(datasetNode, ns.health("hasCodingSystem"), standardNode);
    store.add(standardNode, ns.rdf("type"), ns.dct("Standard"));
  });
};
