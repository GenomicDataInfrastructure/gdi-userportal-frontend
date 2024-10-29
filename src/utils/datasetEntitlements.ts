// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { datasetList } from "@/services/discovery/index.public";
import {
  DatasetEntitlement,
  SearchedDataset,
} from "@/services/discovery/types/dataset.types";
import {
  DatasetSearchOptions,
  QueryOperator,
} from "@/services/discovery/types/datasetSearch.types";
import { Entitlement } from "@/types/entitlements.types";

export const mapToDatasetEntitlement = (
  datasets: SearchedDataset[],
  entitlements: Entitlement[]
): DatasetEntitlement[] => {
  return entitlements.map((e) => ({
    dataset: datasets.find((x) => x.identifier === e.datasetId),
    start: e.start,
    end: e.end,
  }));
};

export const createDatasetEntitlements = async (
  entitlements: Entitlement[]
): Promise<DatasetEntitlement[]> => {
  const options: DatasetSearchOptions = {
    limit: 1000,
    facets: entitlements.map((e) => ({
      source: "ckan",
      type: "DROPDOWN",
      key: "identifier",
      value: e.datasetId,
    })),
    operator: QueryOperator.Or,
  };

  const datasetsResponse = await datasetList(options);

  return mapToDatasetEntitlement(datasetsResponse.data.datasets, entitlements);
};
