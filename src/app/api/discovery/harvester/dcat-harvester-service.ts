// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import {
  DCAT_DATASET,
  getFallbackCatalogue,
  mapDataset,
} from "@/app/api/discovery/harvester/dcat-dataset-mapper";
import {
  formatErrorDetails,
  wrapError,
} from "@/app/api/discovery/harvester/error-utils";
import {
  buildHarvestRequestInit,
  harvestFetch,
} from "@/app/api/discovery/harvester/fetch-options";
import { parseRdfToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";
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
};

export type DatasetMappingError = {
  scope: "dataset";
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

export type MappingError = DatasetMappingError | DistributionMappingError;

export type HarvestCollectors = {
  mappingErrors: MappingError[];
  shaclViolations?: ShaclViolation[];
};

const detectContentTypeFromSource = (source: string) =>
  source.trim().toLowerCase().endsWith(".ttl")
    ? "text/turtle"
    : "application/rdf+xml";

export class DcatHarvesterService {
  private readonly fetcher: FetchLike;

  constructor(fetcher: FetchLike = harvestFetch) {
    this.fetcher = fetcher;
  }

  async parseDatasetsFromRdf(
    rdfText: string,
    sourceRef?: string,
    contentType?: string,
    collectors?: HarvestCollectors
  ): Promise<LocalDiscoveryDataset[]> {
    const resolvedContentType =
      (contentType as Parameters<typeof parseRdfToQuads>[1]) ??
      (sourceRef
        ? (detectContentTypeFromSource(sourceRef) as Parameters<
            typeof parseRdfToQuads
          >[1])
        : ("application/rdf+xml" as const));
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

    return graph
      .getSubjectsOfType(DCAT_DATASET)
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
  }

  async harvestFromUrl(
    url: string,
    options: HarvestOptions = {},
    collectors?: HarvestCollectors
  ): Promise<LocalDiscoveryDataset[]> {
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

    let xmlText: string;
    try {
      xmlText = await response.text();
    } catch (error) {
      throw wrapError(
        `Failed to read DCAT catalogue response body from ${url}: ${formatErrorDetails(error)}`,
        error
      );
    }

    try {
      return await this.parseDatasetsFromRdf(
        xmlText,
        url,
        detectContentTypeFromSource(url),
        collectors
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
    collectors?: HarvestCollectors
  ): Promise<LocalDiscoveryDataset[]> {
    const resolvedPath = resolve(filePath);
    let rdfText: string;

    try {
      rdfText = await readFile(resolvedPath, "utf8");
    } catch (error) {
      throw wrapError(
        `Failed to read DCAT catalogue file from ${resolvedPath}: ${formatErrorDetails(error)}`,
        error
      );
    }

    try {
      return await this.parseDatasetsFromRdf(
        rdfText,
        resolvedPath,
        detectContentTypeFromSource(resolvedPath),
        collectors
      );
    } catch (error) {
      throw wrapError(
        `Failed to parse RDF from ${resolvedPath}: ${formatErrorDetails(error)}`,
        error
      );
    }
  }
}

export const dcatHarvesterService = new DcatHarvesterService();
