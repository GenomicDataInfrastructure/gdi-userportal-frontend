// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";

const DEFAULT_EXPORT_BASE_URL = "http://localhost:3000";

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
