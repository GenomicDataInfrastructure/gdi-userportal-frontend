// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Readable } from "node:stream";
import * as rdf from "rdflib";
import { JsonLdSerializer } from "jsonld-streaming-serializer";
import { rdfSerializer } from "rdf-serialize";

export type RdfExportFormat = "rdf" | "ttl" | "jsonld";

export const getRdfExportMimeType = (format: RdfExportFormat): string => {
  switch (format) {
    case "rdf":
      return "application/rdf+xml";
    case "ttl":
      return "text/turtle";
    case "jsonld":
      return "application/ld+json";
  }
};

const consumeTextStream = async (
  stream: NodeJS.ReadableStream
): Promise<string> => {
  let result = "";
  for await (const chunk of stream) result += chunk.toString();
  return result.endsWith("\n") ? result : `${result}\n`;
};

export const serializeRdfStore = async (
  store: rdf.Formula,
  prefixes: Record<string, string>,
  format: RdfExportFormat
): Promise<string> => {
  switch (format) {
    case "rdf":
      return `${rdf.serialize(null, store, null, "application/rdf+xml", undefined, { namespaces: prefixes })}`;
    case "ttl":
      return consumeTextStream(
        rdfSerializer.serialize(
          Readable.from(store.statements, { objectMode: true }),
          { contentType: "text/turtle", prefixes }
        )
      );
    case "jsonld":
      return consumeTextStream(
        Readable.from(store.statements, { objectMode: true }).pipe(
          new JsonLdSerializer({
            context: prefixes,
            space: "  ",
            useNativeTypes: true,
          })
        )
      );
  }
};
