// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Readable } from "node:stream";
import type * as RDF from "@rdfjs/types";
import { rdfParser } from "rdf-parse";

export const RDF_CONTENT_TYPES = {
  rdfxml: "application/rdf+xml",
  turtle: "text/turtle",
} as const;

export type RdfContentType =
  (typeof RDF_CONTENT_TYPES)[keyof typeof RDF_CONTENT_TYPES];

const getSourcePath = (source: string): string => {
  try {
    return new URL(source).pathname;
  } catch {
    return source.split(/[?#]/, 1)[0] ?? source;
  }
};

export const detectRdfContentType = (
  source?: string,
  contentType?: string | null
): RdfContentType => {
  const normalizedContentType = contentType
    ?.split(";", 1)[0]
    ?.trim()
    .toLowerCase();

  if (
    normalizedContentType === RDF_CONTENT_TYPES.turtle ||
    normalizedContentType === "application/x-turtle"
  ) {
    return RDF_CONTENT_TYPES.turtle;
  }

  if (
    normalizedContentType === RDF_CONTENT_TYPES.rdfxml ||
    normalizedContentType === "application/xml" ||
    normalizedContentType === "text/xml"
  ) {
    return RDF_CONTENT_TYPES.rdfxml;
  }

  const sourcePath = source ? getSourcePath(source).toLowerCase() : "";
  if (/\.(ttl|turtle|n3)$/.test(sourcePath)) {
    return RDF_CONTENT_TYPES.turtle;
  }

  return RDF_CONTENT_TYPES.rdfxml;
};

export const detectContentTypeFromUrl = (url: string): RdfContentType =>
  detectRdfContentType(url);

export const parseRdfToQuads = async (
  rdfText: string,
  contentType: RdfContentType,
  baseIRI?: string
): Promise<RDF.Quad[]> => {
  const quadStream = rdfParser.parse(Readable.from([rdfText]), {
    contentType,
    baseIRI,
  });

  const quads: RDF.Quad[] = [];
  await new Promise<void>((resolve, reject) => {
    quadStream.on("data", (quad: RDF.Quad) => {
      quads.push(quad);
    });
    quadStream.on("error", reject);
    quadStream.on("end", resolve);
  });

  return quads;
};

/** @deprecated Use parseRdfToQuads with RDF_CONTENT_TYPES.rdfxml instead */
export const parseRdfXmlToQuads = async (
  xmlText: string,
  baseIRI?: string
): Promise<RDF.Quad[]> =>
  parseRdfToQuads(xmlText, RDF_CONTENT_TYPES.rdfxml, baseIRI);
