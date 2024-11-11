// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  createDatasetEntitlements,
  mapToDatasetEntitlement,
} from "@/utils/datasetEntitlements";
import {
  DatasetEntitlement,
  SearchedDataset,
} from "@/services/discovery/types/dataset.types";
import { Entitlement } from "@/types/entitlements.types";
import { datasetList } from "@/services/discovery/index.public";
import { AxiosResponse } from "axios";
import { DatasetsSearchResponse } from "@/services/discovery/types/datasetSearch.types";

jest.mock("@/services/discovery/index.public");

describe("datasetEntitlements", () => {
  const mockedDatasetList = datasetList as jest.MockedFunction<
    typeof datasetList
  >;

  it("should correctly map to dataset entitlements", () => {
    const datasets: SearchedDataset[] = [
      { identifier: "1", title: "Dataset 1" } as SearchedDataset,
      { identifier: "2", title: "Dataset 2" } as SearchedDataset,
    ];

    const entitlements: Entitlement[] = [
      { datasetId: "1", start: "2021-01-01", end: "2021-12-31" },
      { datasetId: "2", start: "2022-01-01", end: "2022-12-31" },
    ];

    const expected = [
      {
        dataset: { identifier: "1", title: "Dataset 1" },
        start: "2021-01-01",
        end: "2021-12-31",
      },
      {
        dataset: { identifier: "2", title: "Dataset 2" },
        start: "2022-01-01",
        end: "2022-12-31",
      },
    ];

    const result = mapToDatasetEntitlement(datasets, entitlements);

    expect(result).toEqual(expected);
  });

  it("should return an empty array if no match between datasets and entitlements", () => {
    const datasets: SearchedDataset[] = [
      { identifier: "1", title: "Dataset 1" } as SearchedDataset,
    ];

    const entitlements: Entitlement[] = [
      { datasetId: "2", start: "2021-01-01", end: "2021-12-31" },
    ];

    const expected: DatasetEntitlement[] = [];

    const result = mapToDatasetEntitlement(datasets, entitlements);

    expect(result).toEqual(expected);
  });

  it("should create dataset entitlements", async () => {
    const mockApiResponse = {
      data: {
        results: [
          { identifier: "1", title: "Dataset 1" } as SearchedDataset,
          { identifier: "2", title: "Dataset 2" } as SearchedDataset,
        ],
        count: 2,
      },
    } as AxiosResponse<DatasetsSearchResponse>;

    mockedDatasetList.mockResolvedValue(mockApiResponse);

    const datasetEntitlements = await createDatasetEntitlements([
      { datasetId: "2", start: "2022-01-01", end: "2022-12-31" },
    ]);

    expect(datasetEntitlements).toEqual([
      {
        dataset: { identifier: "2", title: "Dataset 2" },
        start: "2022-01-01",
        end: "2022-12-31",
      },
    ]);
  });
});
