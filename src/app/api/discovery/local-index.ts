// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { createHeaders } from "@/app/api/shared/headers";
import { DatasetSearchQuery } from "@/app/api/discovery/open-api/schemas";
import { DdsDiscoveryProvider } from "@/app/api/discovery/providers/dds-discovery-provider";
import {
  clearLocalDiscoveryDatasets,
  upsertLocalDiscoveryDatasets,
} from "@/app/api/discovery/local-store/factory";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { dcatHarvesterService } from "@/app/api/discovery/harvester/dcat-harvester-service";
import { wrapError } from "@/app/api/discovery/harvester/error-utils";
import { oidcAuthService } from "@/app/api/discovery/harvester/oidc-auth.service";
import { syncHarvestedDatasetsWithNationalDispatcher } from "@/app/api/discovery/harvester/national-dispatcher-client";

export type HarvestLocalIndexMode = "replace" | "append";

export type HarvestLocalIndexOptions = {
  mode?: HarvestLocalIndexMode;
};

export const upsertLocalIndexDatasetsApi = async (
  datasets: LocalDiscoveryDataset[]
): Promise<void> => {
  await upsertLocalDiscoveryDatasets(datasets);
};

export const seedLocalIndexFromDdsApi = async (
  options: DatasetSearchQuery = {}
): Promise<number> => {
  const headers = await createHeaders();
  const provider = new DdsDiscoveryProvider();
  const response = await provider.searchDatasets(options, headers);

  const datasets =
    response.results
      ?.filter((dataset) => Boolean(dataset.id && dataset.title))
      .map((dataset) => ({
        id: dataset.id,
        identifier: dataset.identifier,
        title: dataset.title,
        description: dataset.description,
        catalogue: dataset.catalogue,
        createdAt: dataset.createdAt,
        modifiedAt: dataset.modifiedAt,
        version: dataset.version,
        hasVersions: dataset.hasVersions,
        versionNotes: dataset.versionNotes ? [dataset.versionNotes] : undefined,
        themes: dataset.themes,
        keywords: dataset.keywords,
        temporalCoverage: dataset.temporalCoverage,
        accessRights: dataset.accessRights,
        conformsTo: dataset.conformsTo,
        numberOfRecords: dataset.recordsCount,
        numberOfUniqueIndividuals: dataset.numberOfUniqueIndividuals,
        distributionsCount: dataset.distributionsCount,
        maxTypicalAge: dataset.maxTypicalAge,
        minTypicalAge: dataset.minTypicalAge,
        hasStructuredData: dataset.hasStructuredData,
        publishers: dataset.publishers ?? [],
        hdab: [],
        creators: [],
        publisherType: dataset.publisherType,
      })) ?? [];

  await upsertLocalDiscoveryDatasets(datasets);
  return datasets.length;
};

export const harvestLocalIndexFromDcatUrlApi = async (
  catalogueRdfUrl: string,
  options: HarvestLocalIndexOptions = {}
): Promise<number> => {
  const mode = options.mode ?? "replace";

  const authHeaders = await getAuthHeaders(catalogueRdfUrl);
  const datasets = await harvestDatasets(catalogueRdfUrl, authHeaders);

  if (mode === "replace") {
    await clearIndex(catalogueRdfUrl);
  }

  await indexDatasets(catalogueRdfUrl, datasets);
  await syncWithDispatcher(catalogueRdfUrl, datasets, mode);

  return datasets.length;
};

export const harvestLocalIndexFromDcatFileApi = async (
  catalogueRdfFilePath: string,
  options: HarvestLocalIndexOptions = {}
): Promise<number> => {
  const mode = options.mode ?? "replace";

  const datasets = await harvestFileDatasets(catalogueRdfFilePath);

  if (mode === "replace") {
    await clearLocalDiscoveryDatasets();
  }

  await upsertLocalDiscoveryDatasets(datasets);
  await syncHarvestedDatasetsWithNationalDispatcher(datasets, mode);

  return datasets.length;
};

const getAuthHeaders = async (
  catalogueRdfUrl: string
): Promise<Record<string, string>> => {
  try {
    return await oidcAuthService.getAuthorizationHeaderIfConfigured();
  } catch (error) {
    throw wrapError(
      `Failed to prepare authorization for harvesting ${catalogueRdfUrl}: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
};

const harvestDatasets = async (
  catalogueRdfUrl: string,
  authHeaders: Record<string, string>
): Promise<LocalDiscoveryDataset[]> => {
  try {
    return await dcatHarvesterService.harvestFromUrl(catalogueRdfUrl, {
      headers: authHeaders,
    });
  } catch (error) {
    throw wrapError(
      `Failed to harvest datasets from ${catalogueRdfUrl}: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
};

const harvestFileDatasets = async (
  catalogueRdfFilePath: string
): Promise<LocalDiscoveryDataset[]> => {
  try {
    return await dcatHarvesterService.harvestFromFilePath(catalogueRdfFilePath);
  } catch (error) {
    throw wrapError(
      `Failed to harvest datasets from file ${catalogueRdfFilePath}: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
};

const clearIndex = async (catalogueRdfUrl: string): Promise<void> => {
  try {
    await clearLocalDiscoveryDatasets();
  } catch (error) {
    throw wrapError(
      `Failed to clear the local discovery index before importing ${catalogueRdfUrl}: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
};

const indexDatasets = async (
  catalogueRdfUrl: string,
  datasets: LocalDiscoveryDataset[]
): Promise<void> => {
  try {
    await upsertLocalDiscoveryDatasets(datasets);
  } catch (error) {
    throw wrapError(
      `Failed to index ${datasets.length} harvested datasets from ${catalogueRdfUrl}: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
};

const syncWithDispatcher = async (
  catalogueRdfUrl: string,
  datasets: LocalDiscoveryDataset[],
  mode: HarvestLocalIndexMode
): Promise<void> => {
  try {
    await syncHarvestedDatasetsWithNationalDispatcher(datasets, mode);
  } catch (error) {
    console.error(
      `[national-dispatcher] Sync failed for ${catalogueRdfUrl}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
