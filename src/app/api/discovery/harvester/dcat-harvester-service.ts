// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

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
import { buildHarvestRequestInit } from "@/app/api/discovery/harvester/fetch-options";
import { parseRdfXmlToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;
type HarvestOptions = {
  headers?: Record<string, string>;
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
      response = await this.fetcher(
        url,
        buildHarvestRequestInit({
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
      return await this.parseDatasetsFromRdf(xmlText, url);
    } catch (error) {
      throw wrapError(
        `Failed to parse RDF/XML from ${url}: ${formatErrorDetails(error)}`,
        error
      );
    }
  }
}

export const dcatHarvesterService = new DcatHarvesterService();
