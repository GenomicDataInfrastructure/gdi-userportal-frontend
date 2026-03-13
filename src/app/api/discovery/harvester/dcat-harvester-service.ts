// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import {
  DCAT_DATASET,
  getFallbackCatalogue,
  mapDataset,
} from "@/app/api/discovery/harvester/dcat-dataset-mapper";
import { parseRdfXmlToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;
type HarvestOptions = {
  headers?: Record<string, string>;
};

const formatErrorDetails = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const details = [error.message];
  const cause = error.cause;

  if (cause instanceof Error) {
    const context = [
      "code" in cause && typeof cause.code === "string"
        ? `code=${cause.code}`
        : null,
      "errno" in cause &&
      (typeof cause.errno === "string" || typeof cause.errno === "number")
        ? `errno=${cause.errno}`
        : null,
      "syscall" in cause && typeof cause.syscall === "string"
        ? `syscall=${cause.syscall}`
        : null,
      "hostname" in cause && typeof cause.hostname === "string"
        ? `hostname=${cause.hostname}`
        : null,
      "host" in cause && typeof cause.host === "string"
        ? `host=${cause.host}`
        : null,
      "port" in cause &&
      (typeof cause.port === "string" || typeof cause.port === "number")
        ? `port=${cause.port}`
        : null,
    ].filter(Boolean);

    const causeText = context.length
      ? `${cause.message} (${context.join(", ")})`
      : cause.message;

    if (causeText && causeText !== error.message) {
      details.push(`cause: ${causeText}`);
    }
  }

  return details.join(" | ");
};

export class DcatHarvesterService {
  private readonly fetcher: FetchLike;

  constructor(fetcher: FetchLike = fetch) {
    this.fetcher = fetcher;
  }

  async parseDatasetsFromRdf(
    xmlText: string,
    sourceUrl?: string
  ): Promise<LocalDiscoveryDataset[]> {
    const quads = await parseRdfXmlToQuads(xmlText, sourceUrl);
    const graph = new RdfGraph(quads);
    const fallbackCatalogue = getFallbackCatalogue(graph);

    return graph
      .getSubjectsOfType(DCAT_DATASET)
      .map((datasetSubject, index) =>
        mapDataset(datasetSubject, graph, fallbackCatalogue, index)
      )
      .filter((dataset) => Boolean(dataset.title || dataset.description));
  }

  async harvestFromUrl(
    url: string,
    options: HarvestOptions = {}
  ): Promise<LocalDiscoveryDataset[]> {
    let response: Response;
    try {
      response = await this.fetcher(url, {
        headers: options.headers,
      });
    } catch (error) {
      throw new Error(
        `Failed to download DCAT catalogue from ${url}: ${formatErrorDetails(error)}`
      );
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch DCAT catalogue from ${url} (${response.status} ${response.statusText})`
      );
    }

    let xmlText: string;
    try {
      xmlText = await response.text();
    } catch (error) {
      throw new Error(
        `Failed to read DCAT catalogue response body from ${url}: ${formatErrorDetails(error)}`
      );
    }

    try {
      return await this.parseDatasetsFromRdf(xmlText, url);
    } catch (error) {
      throw new Error(
        `Failed to parse RDF/XML from ${url}: ${formatErrorDetails(error)}`
      );
    }
  }
}

export const dcatHarvesterService = new DcatHarvesterService();
