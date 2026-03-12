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
import { oidcAuthService } from "@/app/api/discovery/harvester/oidc-auth.service";

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
      })) ?? [];

  await upsertLocalDiscoveryDatasets(datasets);
  return datasets.length;
};

export const harvestLocalIndexFromDcatUrlApi = async (
  catalogueRdfUrl: string
): Promise<number> => {
  const authHeaders =
    await oidcAuthService.getAuthorizationHeaderIfConfigured();
  const datasets = await dcatHarvesterService.harvestFromUrl(catalogueRdfUrl, {
    headers: authHeaders,
  });
  await clearLocalDiscoveryDatasets();
  await upsertLocalDiscoveryDatasets(datasets);
  return datasets.length;
};
