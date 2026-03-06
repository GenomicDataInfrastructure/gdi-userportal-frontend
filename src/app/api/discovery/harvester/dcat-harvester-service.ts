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

  private extractDatasetIdentifier(datasetBlock: string): string {
    const identifierMatch = datasetBlock.match(
      /\bdct:identifier\b[^>]*>([\s\S]*?)<\/dct:identifier>/i
    );
    if (identifierMatch && identifierMatch[1]) {
      return normalizeXmlText(identifierMatch[1]);
    }

    return "";
  }

  private extractDatasetRdfAbout(datasetBlock: string): string {
    const aboutMatch = datasetBlock.match(/\brdf:about="([^"]+)"/i);
    if (aboutMatch && aboutMatch[1]) {
      return aboutMatch[1].trim();
    }

    return "";
  }

  private extractCatalogueNameFromRdf(xmlText: string): string {
    const catalogueBlockMatch = xmlText.match(
      /<dcat:Catalog\b[\s\S]*?<\/dcat:Catalog>/i
    );
    if (!catalogueBlockMatch || !catalogueBlockMatch[0]) {
      return "";
    }

    const catalogueBlock = catalogueBlockMatch[0];
    const catalogueTitle = findFirstTagValue(catalogueBlock, [
      "dct:title",
      "dc:title",
    ]);
    if (catalogueTitle) {
      return catalogueTitle;
    }

    const catalogueAboutMatch = catalogueBlock.match(/\brdf:about="([^"]+)"/i);
    if (catalogueAboutMatch && catalogueAboutMatch[1]) {
      return catalogueAboutMatch[1].trim();
    }

    return "";
  }

  private extractDatasetCatalogue(
    datasetBlock: string,
    fallbackCatalogue: string
  ): string {
    const inCatalogResourceMatch = datasetBlock.match(
      /<dcat:inCatalog\b[^>]*\brdf:resource="([^"]+)"[^>]*\/?>/i
    );
    if (inCatalogResourceMatch && inCatalogResourceMatch[1]) {
      return inCatalogResourceMatch[1].trim();
    }

    const inCatalogBlockMatch = datasetBlock.match(
      /<dcat:inCatalog\b[\s\S]*?<\/dcat:inCatalog>/i
    );
    if (inCatalogBlockMatch && inCatalogBlockMatch[0]) {
      const inCatalogTitle = findFirstTagValue(inCatalogBlockMatch[0], [
        "dct:title",
        "dc:title",
      ]);
      if (inCatalogTitle) {
        return inCatalogTitle;
      }
    }

    return fallbackCatalogue;
  }

  private extractDatasetId(
    identifier: string,
    rdfAbout: string,
    index: number
  ): string {
    if (identifier) {
      return identifier;
    }

    if (rdfAbout) {
      return rdfAbout;
    }

    return `dataset-${index + 1}`;
  }

  parseDatasetsFromRdf(xmlText: string): LocalDiscoveryDataset[] {
    const datasetBlocks = extractDatasetBlocks(xmlText);
    const catalogueName = this.extractCatalogueNameFromRdf(xmlText);

    return datasetBlocks
      .map((datasetBlock, index) => {
        const identifier = this.extractDatasetIdentifier(datasetBlock);
        const rdfAbout = this.extractDatasetRdfAbout(datasetBlock);
        const id = this.extractDatasetId(identifier, rdfAbout, index);
        const title = this.extractDatasetTitle(datasetBlock);
        const description = this.extractDatasetDescription(datasetBlock);
        const catalogue = this.extractDatasetCatalogue(
          datasetBlock,
          catalogueName
        );

        return {
          id,
          identifier,
          title,
          description,
          catalogue,
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
