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
    const response = await this.fetcher(url, {
      headers: options.headers,
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch DCAT catalogue (${response.status} ${response.statusText})`
      );
    }

    const xmlText = await response.text();
    return this.parseDatasetsFromRdf(xmlText, url);
  }
}

export const dcatHarvesterService = new DcatHarvesterService();
