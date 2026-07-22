// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addLiteral,
  addNamedNode,
  createLanguageLiteral,
  createLiteral,
  createNamedNode,
  createNestedNode,
  isAbsoluteUri,
  isNonEmptyString,
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
      const { value, label } = distribution.format;
      if (isNonEmptyString(value) && isAbsoluteUri(value)) {
        const formatNode = createNamedNode(value);
        store.add(distributionNode, ns.dct("format"), formatNode);
        store.add(formatNode, ns.rdf("type"), ns.dct("MediaTypeOrExtent"));
        if (isNonEmptyString(label)) {
          store.add(
            formatNode,
            ns.skos("prefLabel"),
            createLanguageLiteral(label, "eng")
          );
        }
      }
    }

    if (distribution.mediaType) {
      const { value, label } = distribution.mediaType;
      if (isNonEmptyString(value) && isAbsoluteUri(value)) {
        const mediaTypeNode = createNamedNode(value);
        store.add(distributionNode, ns.dcat("mediaType"), mediaTypeNode);
        store.add(mediaTypeNode, ns.rdf("type"), ns.dct("MediaType"));
        if (isNonEmptyString(label)) {
          store.add(
            mediaTypeNode,
            ns.skos("prefLabel"),
            createLanguageLiteral(label, "eng")
          );
        }
      }
    }

    if (distribution.license) {
      const { value, label } = distribution.license;
      if (isNonEmptyString(value) && isAbsoluteUri(value)) {
        const licenseNode = createNamedNode(value);
        store.add(distributionNode, ns.dct("license"), licenseNode);
        store.add(licenseNode, ns.rdf("type"), ns.dct("LicenseDocument"));
        if (isNonEmptyString(label)) {
          store.add(
            licenseNode,
            ns.skos("prefLabel"),
            createLanguageLiteral(label, "eng")
          );
        }
      }
    }

    distribution.conformsTo?.forEach((entry) => {
      if (isNonEmptyString(entry.value) && isAbsoluteUri(entry.value)) {
        const standardNode = createNamedNode(entry.value);
        store.add(distributionNode, ns.dct("conformsTo"), standardNode);
        store.add(standardNode, ns.rdf("type"), ns.dct("Standard"));
      }
    });

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
