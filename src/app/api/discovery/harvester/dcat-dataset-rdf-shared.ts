// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";

const DEFAULT_EXPORT_BASE_URL = "http://localhost:3000";

export const DATASET_EXPORT_PREFIXES = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  dcat: "http://www.w3.org/ns/dcat#",
  dct: "http://purl.org/dc/terms/",
  adms: "http://www.w3.org/ns/adms#",
  healthdcatap: "http://healthdataportal.eu/ns/health#",
  dcatap: "http://data.europa.eu/r5r/",
  skos: "http://www.w3.org/2004/02/skos/core#",
  dpv: "http://www.w3.org/ns/dpv#",
  foaf: "http://xmlns.com/foaf/0.1/",
  vcard: "http://www.w3.org/2006/vcard/ns#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
} as const;

export const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const escapeTurtleLiteral = (value: string): string =>
  value
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\n", "\\n")
    .replaceAll("\r", "\\r")
    .replaceAll("\t", "\\t");

export const isAbsoluteUri = (value: string): boolean =>
  /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value);

export const isNonEmptyString = (value?: string | null): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const toMailtoUri = (value?: string): string | undefined => {
  if (!isNonEmptyString(value)) {
    return undefined;
  }

  return value.startsWith("mailto:") ? value : `mailto:${value}`;
};

export const toHttpUri = (value?: string): string | undefined =>
  isNonEmptyString(value) ? value : undefined;

function trimTrailingSlashes(value: string): string {
  let end = value.length;

  while (end > 0 && value.charCodeAt(end - 1) === 47) {
    end -= 1;
  }

  return value.slice(0, end);
}

export const getLocalDiscoveryExportBaseUrl = (): string =>
  trimTrailingSlashes(
    process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_EXPORT_BASE_URL
  );

const getDatasetExportKey = (dataset: LocalDiscoveryDataset): string =>
  dataset.identifier || dataset.id || "unknown-dataset";

export const getDatasetExportUri = (dataset: LocalDiscoveryDataset): string => {
  if (dataset.id && isAbsoluteUri(dataset.id)) {
    return dataset.id;
  }

  return `${getLocalDiscoveryExportBaseUrl()}/datasets/${encodeURIComponent(
    getDatasetExportKey(dataset)
  )}`;
};

export const getDatasetRdfAboutAttribute = (
  dataset: LocalDiscoveryDataset
): string => ` rdf:about="${escapeXml(getDatasetExportUri(dataset))}"`;

export const getDatasetTurtleSubject = (
  dataset: LocalDiscoveryDataset
): string => `<${getDatasetExportUri(dataset)}>`;

export const getDatasetNestedResourceUri = (
  dataset: LocalDiscoveryDataset,
  segment: string
): string => `${getDatasetExportUri(dataset)}#${encodeURIComponent(segment)}`;
