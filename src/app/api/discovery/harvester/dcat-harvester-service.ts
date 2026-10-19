// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type * as RDF from "@rdfjs/types";
import {
  LocalDiscoveryAiModel,
  LocalDiscoveryDataset,
} from "@/app/api/discovery/local-store/types";
import {
  DCAT_DATASET,
  getFallbackCatalogue,
  mapDataset,
} from "@/app/api/discovery/harvester/dcat-dataset-mapper";
import {
  isAiModelSubject,
  mapAiModel,
} from "@/app/api/discovery/harvester/dcat-ai-model-mapper";
import {
  formatErrorDetails,
  wrapError,
} from "@/app/api/discovery/harvester/error-utils";
import {
  buildHarvestRequestInit,
  harvestFetch,
} from "@/app/api/discovery/harvester/fetch-options";
import {
  detectRdfContentType,
  parseRdfToQuads,
} from "@/app/api/discovery/harvester/rdf-quad-loader";
import { sanitizeRdfIris } from "@/app/api/discovery/harvester/rdf-iri-sanitizer";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";
import {
  ShaclViolation,
  validateHealthDcatAp,
} from "@/app/api/discovery/harvester/shacl/shacl-validator";
import { DistributionMappingError as DistributionMappingErrorInput } from "@/app/api/discovery/harvester/dcat-distribution-mapper";

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;
type HarvestOptions = {
  headers?: Record<string, string>;
  contentType?: string;
  includeAiModels?: boolean;
};

export type DatasetMappingError = {
  scope: "dataset";
  subjectId: string;
  message: string;
  stack?: string;
};

export type AiModelMappingError = {
  scope: "aiModel";
  subjectId: string;
  message: string;
  stack?: string;
};

export type DistributionMappingError = {
  scope: "distribution";
  datasetId: string;
  distributionId?: string;
  message: string;
  stack?: string;
};

export type MappingError =
  | DatasetMappingError
  | AiModelMappingError
  | DistributionMappingError;

export type HarvestCollectors = {
  mappingErrors: MappingError[];
  shaclViolations?: ShaclViolation[];
};

export type HarvestedCatalogue = {
  datasets: LocalDiscoveryDataset[];
  aiModels: LocalDiscoveryAiModel[];
};

export class DcatHarvesterService {
  private readonly fetcher: FetchLike;

  constructor(fetcher: FetchLike = harvestFetch) {
    this.fetcher = fetcher;
  }

  async parseCatalogueFromRdf(
    rdfText: string,
    sourceRef?: string,
    contentType?: string,
    collectors?: HarvestCollectors,
    includeAiModels = true
  ): Promise<HarvestedCatalogue> {
    const resolvedContentType = detectRdfContentType(sourceRef, contentType);
    const quads = await parseRdfToQuads(
      sanitizeRdfIris(rdfText, resolvedContentType),
      resolvedContentType,
      sourceRef
    );
    const graph = new RdfGraph(quads);
    const fallbackCatalogue = getFallbackCatalogue(graph);

    if (collectors?.shaclViolations) {
      try {
        collectors.shaclViolations.push(...(await validateHealthDcatAp(quads)));
      } catch (error) {
        console.error(
          `[HealthDCAT-AP validation] Failed to run SHACL validation: ${formatErrorDetails(error)}`
        );
      }
    }

    const onDistributionError = collectors
      ? (distributionError: DistributionMappingErrorInput) =>
          collectors.mappingErrors.push({
            scope: "distribution",
            ...distributionError,
          })
      : undefined;

    const { datasetSubjects, aiModelSubjects } = graph
      .getSubjectsOfType(DCAT_DATASET)
      .reduce(
        (partition, subject) => {
          if (isAiModelSubject(subject, graph)) {
            if (includeAiModels) partition.aiModelSubjects.push(subject);
          } else {
            partition.datasetSubjects.push(subject);
          }
          return partition;
        },
        { datasetSubjects: [] as RDF.Term[], aiModelSubjects: [] as RDF.Term[] }
      );

    const datasets = datasetSubjects
      .flatMap((datasetSubject, index) => {
        try {
          return [
            mapDataset(
              datasetSubject,
              graph,
              fallbackCatalogue,
              index,
              onDistributionError
            ),
          ];
        } catch (error) {
          if (!collectors) {
            throw error;
          }

          collectors.mappingErrors.push({
            scope: "dataset",
            subjectId: datasetSubject.value,
            message: formatErrorDetails(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          return [];
        }
      })
      .filter((dataset) => Boolean(dataset.title || dataset.description));

    const aiModels = aiModelSubjects
      .flatMap((subject, index) => {
        try {
          return [mapAiModel(subject, graph, index)];
        } catch (error) {
          if (!collectors) {
            throw error;
          }

          collectors.mappingErrors.push({
            scope: "aiModel",
            subjectId: subject.value,
            message: formatErrorDetails(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          return [];
        }
      })
      .filter((aiModel) => Boolean(aiModel.title || aiModel.description));

    return { datasets, aiModels };
  }

  async harvestFromUrl(
    url: string,
    options: HarvestOptions = {},
    collectors?: HarvestCollectors
  ): Promise<HarvestedCatalogue> {
    const { text, contentType } = await this.fetchRdfText(url, options);

    try {
      return await this.parseCatalogueFromRdf(
        text,
        url,
        detectRdfContentType(url, contentType),
        collectors,
        options.includeAiModels
      );
    } catch (error) {
      throw wrapError(
        `Failed to parse RDF from ${url}: ${formatErrorDetails(error)}`,
        error
      );
    }
  }

  async harvestFromFilePath(
    filePath: string,
    collectors?: HarvestCollectors,
    contentType?: string,
    includeAiModels = true
  ): Promise<HarvestedCatalogue> {
    const { text, resolvedPath } = await this.readRdfFile(
      filePath,
      contentType
    );

    try {
      return await this.parseCatalogueFromRdf(
        text,
        resolvedPath,
        detectRdfContentType(resolvedPath, contentType),
        collectors,
        includeAiModels
      );
    } catch (error) {
      throw wrapError(
        `Failed to parse RDF from ${resolvedPath}: ${formatErrorDetails(error)}`,
        error
      );
    }
  }

  private async fetchRdfText(
    url: string,
    options: HarvestOptions
  ): Promise<{ text: string; contentType?: string }> {
    let response: Response;
    try {
      response = await this.fetcher(
        url,
        buildHarvestRequestInit(url, {
          headers: options.headers,
        })
      );
    } catch (error) {
      throw wrapError(
        `Failed to download DCAT catalogue from ${url}: ${formatErrorDetails(error)}`,
        error
      );
    }

    if (!response.ok) {
      const contentType = response.headers.get("content-type") || undefined;
      let bodySnippet: string | undefined;

      try {
        const responseBody = await response.text();
        const compactBody = responseBody.replace(/\s+/g, " ").trim();
        if (compactBody) {
          bodySnippet =
            compactBody.length > 400
              ? `${compactBody.slice(0, 400)}...`
              : compactBody;
        }
      } catch (error) {
        bodySnippet = `unable to read error response body: ${formatErrorDetails(error)}`;
      }

      const details = [
        `Failed to fetch DCAT catalogue from ${url} (${response.status} ${response.statusText})`,
        contentType ? `content-type: ${contentType}` : null,
        bodySnippet ? `response body: ${bodySnippet}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      throw new Error(details);
    }

    const responseContentType =
      options.contentType?.trim() ||
      response.headers?.get("content-type") ||
      undefined;

    try {
      const text = await response.text();
      return { text, contentType: responseContentType };
    } catch (error) {
      throw wrapError(
        `Failed to read DCAT catalogue response body from ${url}: ${formatErrorDetails(error)}`,
        error
      );
    }
  }

  private async readRdfFile(
    filePath: string,
    _contentType?: string
  ): Promise<{ text: string; resolvedPath: string }> {
    const resolvedPath = resolve(filePath);

    try {
      const text = await readFile(resolvedPath, "utf8");
      return { text, resolvedPath };
    } catch (error) {
      throw wrapError(
        `Failed to read DCAT catalogue file from ${resolvedPath}: ${formatErrorDetails(error)}`,
        error
      );
    }
  }
}

export const dcatHarvesterService = new DcatHarvesterService();
