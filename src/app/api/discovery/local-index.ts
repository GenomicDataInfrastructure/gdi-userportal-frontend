// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { randomUUID } from "node:crypto";
import { createHeaders } from "@/app/api/shared/headers";
import { DatasetSearchQuery } from "@/app/api/discovery/open-api/schemas";
import { DdsDiscoveryProvider } from "@/app/api/discovery/providers/dds-discovery-provider";
import {
  clearLocalDiscoveryDatasets,
  upsertLocalDiscoveryDatasets,
} from "@/app/api/discovery/local-store/factory";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import {
  DatasetMappingError,
  dcatHarvesterService,
  HarvestCollectors,
} from "@/app/api/discovery/harvester/dcat-harvester-service";
import { DistributionMappingError } from "@/app/api/discovery/harvester/dcat-distribution-mapper";
import {
  formatErrorDetails,
  wrapError,
} from "@/app/api/discovery/harvester/error-utils";
import { oidcAuthService } from "@/app/api/discovery/harvester/oidc-auth.service";
import { collectDatasetFieldWarnings } from "@/app/api/discovery/harvester/dataset-field-validation";
import { ShaclViolation } from "@/app/api/discovery/harvester/shacl/shacl-validator";
import {
  isHarvesterLoggingEnabled,
  writeHarvesterRunLog,
} from "@/app/api/discovery/local-store/harvester-logs/factory";
import { HarvesterRunLog } from "@/app/api/discovery/local-store/harvester-logs/types";

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

  return runHarvestWithLogging(
    { url: catalogueRdfUrl },
    mode,
    async (collectors) => {
      const authHeaders = await getAuthHeaders(catalogueRdfUrl);
      const datasets = await harvestDatasets(
        catalogueRdfUrl,
        authHeaders,
        collectors
      );

      if (mode === "replace") {
        await clearIndex(catalogueRdfUrl);
      }

      await indexDatasets(catalogueRdfUrl, datasets);
      return datasets;
    }
  );
};

export const harvestLocalIndexFromDcatFileApi = async (
  catalogueRdfFilePath: string,
  options: HarvestLocalIndexOptions = {}
): Promise<number> => {
  const mode = options.mode ?? "replace";

  return runHarvestWithLogging(
    { path: catalogueRdfFilePath },
    mode,
    async (collectors) => {
      const datasets = await harvestFileDatasets(
        catalogueRdfFilePath,
        collectors
      );

      if (mode === "replace") {
        await clearLocalDiscoveryDatasets();
      }

      await upsertLocalDiscoveryDatasets(datasets);
      return datasets;
    }
  );
};

const runHarvestWithLogging = async (
  source: { url?: string; path?: string },
  mode: HarvestLocalIndexMode,
  run: (collectors: HarvestCollectors) => Promise<LocalDiscoveryDataset[]>
): Promise<number> => {
  const loggingEnabled = isHarvesterLoggingEnabled();
  const startedAt = new Date().toISOString();
  const collectors: HarvestCollectors = {
    mappingErrors: [],
    distributionWarnings: [],
    shaclViolations: loggingEnabled ? [] : undefined,
  };

  try {
    const datasets = await run(collectors);

    if (loggingEnabled) {
      await logHarvesterRun({
        startedAt,
        source,
        mode,
        succeeded: datasets.length,
        mappingErrors: collectors.mappingErrors,
        warnings: [
          ...collectDatasetFieldWarnings(datasets),
          ...mapShaclViolationsToWarnings(collectors.shaclViolations ?? []),
          ...mapDistributionWarnings(collectors.distributionWarnings ?? []),
        ],
        succeededDatasets: datasets.map((dataset) => ({
          subjectId: dataset.id,
          datasetTitle: dataset.title || undefined,
        })),
      });
    }

    return datasets.length;
  } catch (error) {
    if (loggingEnabled) {
      await logHarvesterRun({
        startedAt,
        source,
        mode,
        succeeded: 0,
        mappingErrors: collectors.mappingErrors,
        runError: error,
      });
    }
    throw error;
  }
};

const mapShaclViolationsToWarnings = (
  shaclViolations: ShaclViolation[]
): HarvesterRunLog["warnings"] => {
  const bySubject = new Map<
    string,
    { datasetTitle?: string; details: string[] }
  >();

  for (const violation of shaclViolations) {
    const subjectId = violation.subjectId ?? "unknown";
    const label = violation.field
      ? `${violation.field}: ${violation.message}`
      : violation.message;

    const existing = bySubject.get(subjectId);
    if (existing) {
      existing.details.push(label);
    } else {
      bySubject.set(subjectId, {
        datasetTitle: violation.datasetTitle,
        details: [label],
      });
    }
  }

  return Array.from(bySubject.entries()).map(
    ([subjectId, { datasetTitle, details }]) => ({
      subjectId,
      datasetTitle,
      type: "healthDcatApCompliance" as const,
      details,
    })
  );
};

const mapDistributionWarnings = (
  distributionWarnings: DistributionMappingError[]
): HarvesterRunLog["warnings"] => {
  const bySubject = new Map<string, string[]>();

  for (const warning of distributionWarnings) {
    const label = warning.distributionId
      ? `${warning.distributionId}: ${warning.message}`
      : warning.message;

    const existing = bySubject.get(warning.datasetId);
    if (existing) {
      existing.push(label);
    } else {
      bySubject.set(warning.datasetId, [label]);
    }
  }

  return Array.from(bySubject.entries()).map(([subjectId, details]) => ({
    subjectId,
    type: "distributionIssue" as const,
    details,
  }));
};

const logHarvesterRun = async (params: {
  startedAt: string;
  source: { url?: string; path?: string };
  mode: HarvestLocalIndexMode;
  succeeded: number;
  mappingErrors: DatasetMappingError[];
  warnings?: HarvesterRunLog["warnings"];
  succeededDatasets?: HarvesterRunLog["succeededDatasets"];
  runError?: unknown;
}): Promise<void> => {
  const {
    startedAt,
    source,
    mode,
    succeeded,
    mappingErrors,
    warnings = [],
    succeededDatasets = [],
    runError,
  } = params;

  const errors: HarvesterRunLog["errors"] = mappingErrors.map((error) => ({
    subjectId: error.subjectId,
    message: error.message,
    stack: error.stack,
  }));

  if (runError) {
    errors.push({
      message: formatErrorDetails(runError),
      stack: runError instanceof Error ? runError.stack : undefined,
    });
  }

  const status: HarvesterRunLog["status"] =
    errors.length === 0 ? "success" : succeeded > 0 ? "partial" : "failed";

  const log: HarvesterRunLog = {
    runId: randomUUID(),
    startedAt,
    finishedAt: new Date().toISOString(),
    source,
    mode,
    status,
    succeeded,
    failed: errors.length,
    errors,
    warnings,
    succeededDatasets,
  };

  try {
    await writeHarvesterRunLog(log);
  } catch (error) {
    console.error(
      `[HarvesterLogs] Failed to write run log: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
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
  authHeaders: Record<string, string>,
  collectors?: HarvestCollectors
): Promise<LocalDiscoveryDataset[]> => {
  try {
    return await dcatHarvesterService.harvestFromUrl(
      catalogueRdfUrl,
      {
        headers: authHeaders,
      },
      collectors
    );
  } catch (error) {
    throw wrapError(
      `Failed to harvest datasets from ${catalogueRdfUrl}: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
};

const harvestFileDatasets = async (
  catalogueRdfFilePath: string,
  collectors?: HarvestCollectors
): Promise<LocalDiscoveryDataset[]> => {
  try {
    return await dcatHarvesterService.harvestFromFilePath(
      catalogueRdfFilePath,
      collectors
    );
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
