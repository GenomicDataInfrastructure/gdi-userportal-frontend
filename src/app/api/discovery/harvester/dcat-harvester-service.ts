// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import {
  extractDatasetBlocks,
  findFirstTagValue,
  normalizeXmlText,
} from "@/app/api/discovery/harvester/dcat-harvester-utils";

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;
type HarvestOptions = {
  headers?: Record<string, string>;
};

export class DcatHarvesterService {
  private readonly fetcher: FetchLike;

  constructor(fetcher: FetchLike = fetch) {
    this.fetcher = fetcher;
  }

  private extractDatasetTitle(datasetBlock: string): string {
    return findFirstTagValue(datasetBlock, ["dct:title", "dc:title"]);
  }

  private extractDatasetDescription(datasetBlock: string): string {
    return findFirstTagValue(datasetBlock, [
      "dct:description",
      "dc:description",
    ]);
  }

  private extractDatasetId(datasetBlock: string, index: number): string {
    const idMatch = datasetBlock.match(
      /\bdct:identifier\b[^>]*>([\s\S]*?)<\/dct:identifier>/i
    );
    if (idMatch && idMatch[1]) {
      return normalizeXmlText(idMatch[1]);
    }

    const aboutMatch = datasetBlock.match(/\brdf:about="([^"]+)"/i);
    if (aboutMatch && aboutMatch[1]) {
      return aboutMatch[1].trim();
    }

    return `dataset-${index + 1}`;
  }

  parseDatasetsFromRdf(xmlText: string): LocalDiscoveryDataset[] {
    const datasetBlocks = extractDatasetBlocks(xmlText);

    return datasetBlocks
      .map((datasetBlock, index) => {
        const title = this.extractDatasetTitle(datasetBlock);
        const description = this.extractDatasetDescription(datasetBlock);
        const id = this.extractDatasetId(datasetBlock, index);

        return {
          id,
          title,
          description,
        };
      })
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
    return this.parseDatasetsFromRdf(xmlText);
  }
}

export const dcatHarvesterService = new DcatHarvesterService();
