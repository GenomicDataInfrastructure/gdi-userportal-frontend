// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryAiModel } from "@/app/api/discovery/local-store/types";
import {
  getRdfExportMimeType,
  RdfExportFormat,
  serializeRdfStore,
} from "@/app/api/discovery/harvester/rdf/rdf-serializer";
import {
  buildAiModelRdfStore,
  getAiModelExportPrefixes,
} from "@/app/api/discovery/harvester/dcat-ai-model-quad-builder";
import { applyRdfXmlPostProcessing } from "@/app/api/discovery/harvester/rdfxml-post-processor";

export const serializeLocalDiscoveryAiModel = async (
  aiModel: LocalDiscoveryAiModel,
  format: RdfExportFormat
): Promise<string> => {
  const serialized = await serializeRdfStore(
    buildAiModelRdfStore(aiModel),
    getAiModelExportPrefixes(),
    format
  );
  return format === "rdf" ? applyRdfXmlPostProcessing(serialized) : serialized;
};

export const getLocalDiscoveryAiModelExportMimeType = (
  format: RdfExportFormat
): string => getRdfExportMimeType(format);
