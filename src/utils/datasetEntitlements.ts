// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetSearchQuery,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";
import { Entitlement } from "@/app/api/access-management/open-api/schemas";
import { searchDatasetsApi } from "@/app/api/discovery";
import { DatasetEntitlement } from "@/app/api/access-management/additional-types";
import { QueryOperator } from "@/app/api/discovery/additional-types";

export const mapToDatasetEntitlement = (
  datasets: SearchedDataset[],
  entitlements: Entitlement[]
): DatasetEntitlement[] => {
  return entitlements
    .filter(
      (e) => datasets.find((x) => x.identifier === e.datasetId) !== undefined
    )
    .map((e) => ({
      dataset: datasets.find(
        (x) => x.identifier === e.datasetId
      ) as SearchedDataset,
      start: e.start,
      end: e.end,
    }));
};

export const createDatasetEntitlements = async (
  entitlements: Entitlement[]
): Promise<DatasetEntitlement[]> => {
  const options: DatasetSearchQuery = {
    rows: 1000,
    facets: entitlements.map((e) => ({
      source: "ckan",
      type: "DROPDOWN",
      key: "identifier",
      value: e.datasetId,
    })),
    operator: QueryOperator.OR,
  };

  const { results: datasets } = await searchDatasetsApi(options);

  return mapToDatasetEntitlement(datasets!, entitlements);
};
