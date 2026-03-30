// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import * as rdf from "rdflib";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import {
  DATASET_EXPORT_PREFIXES,
  getDatasetExportUri,
  getDatasetNestedResourceUri,
  isAbsoluteUri,
  isNonEmptyString,
  toMailtoUri,
} from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";

export type RdfStore = any;
export type RdfNamedNode = any;

export interface DatasetRdfContext {
  dataset: LocalDiscoveryDataset;
  store: RdfStore;
  datasetNode: RdfNamedNode;
}

export const ns = {
  rdf: rdf.Namespace(DATASET_EXPORT_PREFIXES.rdf),
  dcat: rdf.Namespace(DATASET_EXPORT_PREFIXES.dcat),
  dct: rdf.Namespace(DATASET_EXPORT_PREFIXES.dct),
  adms: rdf.Namespace(DATASET_EXPORT_PREFIXES.adms),
  health: rdf.Namespace(DATASET_EXPORT_PREFIXES.healthdcatap),
  dcatap: rdf.Namespace(DATASET_EXPORT_PREFIXES.dcatap),
  skos: rdf.Namespace(DATASET_EXPORT_PREFIXES.skos),
  dpv: rdf.Namespace(DATASET_EXPORT_PREFIXES.dpv),
  foaf: rdf.Namespace(DATASET_EXPORT_PREFIXES.foaf),
  vcard: rdf.Namespace(DATASET_EXPORT_PREFIXES.vcard),
  xsd: rdf.Namespace(DATASET_EXPORT_PREFIXES.xsd),
} as const;

export const createDatasetRdfContext = (
  dataset: LocalDiscoveryDataset
): DatasetRdfContext => ({
  dataset,
  store: rdf.graph(),
  datasetNode: rdf.namedNode(getDatasetExportUri(dataset)),
});

export const createNamedNode = (value: string): RdfNamedNode =>
  rdf.namedNode(value);

export const createNestedNode = (
  context: DatasetRdfContext,
  segment: string
): RdfNamedNode =>
  createNamedNode(getDatasetNestedResourceUri(context.dataset, segment));

export const createLiteral = (value: string, datatype?: string) =>
  datatype ? rdf.literal(value, createNamedNode(datatype)) : rdf.literal(value);

export const createIntegerLiteral = (value: number) =>
  createLiteral(String(value), `${DATASET_EXPORT_PREFIXES.xsd}integer`);

export const createDecimalLiteral = (value: number) =>
  createLiteral(String(value), `${DATASET_EXPORT_PREFIXES.xsd}decimal`);

export const createDateTimeLiteral = (value: string) =>
  createLiteral(value, `${DATASET_EXPORT_PREFIXES.xsd}dateTime`);

export const createDurationLiteral = (value: string) =>
  createLiteral(value, `${DATASET_EXPORT_PREFIXES.xsd}duration`);

export const addLiteral = (
  store: RdfStore,
  subject: RdfNamedNode,
  predicate: RdfNamedNode,
  value?: string,
  datatype?: string
) => {
  if (isNonEmptyString(value)) {
    store.add(subject, predicate, createLiteral(value, datatype));
  }
};

export const addNamedNode = (
  store: RdfStore,
  subject: RdfNamedNode,
  predicate: RdfNamedNode,
  value?: string
) => {
  if (isNonEmptyString(value) && isAbsoluteUri(value)) {
    store.add(subject, predicate, createNamedNode(value));
  }
};

export const addConcept = (
  store: RdfStore,
  subject: RdfNamedNode,
  predicate: RdfNamedNode,
  value?: string,
  label?: string
) => {
  if (!isNonEmptyString(value)) {
    return;
  }

  if (isAbsoluteUri(value)) {
    const concept = createNamedNode(value);
    store.add(subject, predicate, concept);
    if (isNonEmptyString(label)) {
      store.add(concept, ns.skos("prefLabel"), createLiteral(label));
    }
    return;
  }

  store.add(subject, predicate, createLiteral(value));
};

export {
  DATASET_EXPORT_PREFIXES,
  getDatasetExportUri,
  getDatasetNestedResourceUri,
  isAbsoluteUri,
  isNonEmptyString,
  toMailtoUri,
};
