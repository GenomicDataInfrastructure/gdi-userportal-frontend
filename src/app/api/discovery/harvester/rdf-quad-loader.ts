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

export const detectContentTypeFromUrl = (url: string): RdfContentType => {
  const pathname = new URL(url).pathname;
  if (pathname.endsWith(".ttl")) return RDF_CONTENT_TYPES.turtle;
  return RDF_CONTENT_TYPES.rdfxml;
};

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
