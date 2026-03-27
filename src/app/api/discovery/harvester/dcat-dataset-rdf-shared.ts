// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";

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

export const getDatasetRdfAboutAttribute = (
  dataset: LocalDiscoveryDataset
): string => {
  if (!dataset.id || !isAbsoluteUri(dataset.id)) {
    return "";
  }

  return ` rdf:about="${escapeXml(dataset.id)}"`;
};

export const getDatasetTurtleSubject = (
  dataset: LocalDiscoveryDataset
): string =>
  dataset.id && isAbsoluteUri(dataset.id) ? `<${dataset.id}>` : "[]";
