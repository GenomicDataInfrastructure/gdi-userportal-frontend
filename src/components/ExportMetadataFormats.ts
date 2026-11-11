// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export type ExportMetadataFormat = "rdf" | "ttl" | "jsonld";

export type ExportMetadataItem = {
  format: ExportMetadataFormat;
  label: string;
  style: Record<string, unknown>;
};

// This module intentionally has no "use client" directive: detail-page
// Server Components need the format list while the button remains client-side.
export const exportMetadataFormats: ExportMetadataItem[] = [
  {
    format: "rdf",
    label: "RDF",
    style: {
      backgroundColor: "var(--color-warning)",
      ":hover": { backgroundColor: "var(--color-hover)" },
    },
  },
  {
    format: "ttl",
    label: "TTL",
    style: { backgroundColor: "var(--color-info)", color: "white" },
  },
  {
    format: "jsonld",
    label: "JSON-LD",
    style: { backgroundColor: "var(--color-secondary)", color: "black" },
  },
];
