// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Readable } from "node:stream";
import type * as RDF from "@rdfjs/types";
import { rdfParser } from "rdf-parse";

export const parseRdfXmlToQuads = async (
  xmlText: string,
  baseIRI?: string
): Promise<RDF.Quad[]> => {
  const quadStream = rdfParser.parse(Readable.from([xmlText]), {
    contentType: "application/rdf+xml",
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
