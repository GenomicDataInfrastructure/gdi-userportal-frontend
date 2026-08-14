// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetSearchQuery,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";
import { searchDatasetsApi } from "@/app/api/discovery";
import {
  DatasetEntitlement,
  Entitlement,
} from "@/app/api/access-management/additional-types";
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
      source: e.source,
      by: e.by,
    }));
};

export const createDatasetEntitlements = async (
  entitlements: Entitlement[]
): Promise<DatasetEntitlement[]> => {
  if (entitlements.length === 0) return [];

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

  let datasets: SearchedDataset[] = [];
  try {
    const { results } = await searchDatasetsApi(options);
    datasets = results ?? [];
  } catch (error) {
    console.warn("[entitlements] dataset search failed", { error });
  }

  return entitlements.map((e) => {
    const dataset = datasets.find((x) => x.identifier === e.datasetId);
    if (!dataset) {
      console.warn("[entitlements] dataset lookup failed", {
        datasetId: e.datasetId,
        reason: "No matching dataset found in catalog",
      });
      return {
        datasetId: e.datasetId,
        start: e.start,
        end: e.end,
        source: e.source,
        by: e.by,
      };
    }
    return {
      dataset,
      datasetId: e.datasetId,
      start: e.start,
      end: e.end,
      source: e.source,
      by: e.by,
    };
  });
};

export const findDatasetByIdentifier = async (
  identifier: string
): Promise<SearchedDataset | undefined> => {
  const { results } = await searchDatasetsApi({
    rows: 1,
    facets: [
      {
        source: "ckan",
        type: "DROPDOWN",
        key: "identifier",
        value: identifier,
      },
    ],
  });
  return results?.[0];
};
