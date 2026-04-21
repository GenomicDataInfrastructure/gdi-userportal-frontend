// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Readable } from "node:stream";
import * as rdf from "rdflib";
import { JsonLdSerializer } from "jsonld-streaming-serializer";
import { rdfSerializer } from "rdf-serialize";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { LocalDiscoveryDatasetExportFormat } from "@/app/api/discovery/harvester/dcat-dataset-export-types";
import {
  buildDatasetRdfStore,
  getDatasetExportPrefixes,
} from "@/app/api/discovery/harvester/dcat-dataset-quad-builder";

const consumeTextStream = async (
  stream: NodeJS.ReadableStream
): Promise<string> => {
  let result = "";

  for await (const chunk of stream) {
    result += chunk.toString();
  }

  return result.endsWith("\n") ? result : `${result}\n`;
};

const serializeWithRdfSerialize = async (
  store: rdf.Formula,
  contentType: string,
  options?: Record<string, unknown>
): Promise<string> =>
  consumeTextStream(
    rdfSerializer.serialize(
      Readable.from(store.statements, { objectMode: true }),
      {
        contentType,
        ...options,
      }
    )
  );

export const serializeDatasetStore = async (
  dataset: LocalDiscoveryDataset,
  format: LocalDiscoveryDatasetExportFormat
): Promise<string> => {
  const store = buildDatasetRdfStore(dataset);
  const prefixes = getDatasetExportPrefixes();

  switch (format) {
    case "rdf":
      return `${rdf.serialize(
        null,
        store,
        null,
        "application/rdf+xml",
        undefined,
        { namespaces: prefixes }
      )}`;
    case "ttl":
      return serializeWithRdfSerialize(store, "text/turtle", { prefixes });
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
