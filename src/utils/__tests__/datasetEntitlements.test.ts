// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  createDatasetEntitlements,
  mapToDatasetEntitlement,
  findDatasetByIdentifier,
} from "@/utils/datasetEntitlements";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";
import { Entitlement } from "@/app/api/access-management/open-api/schemas";
import { DatasetEntitlement } from "@/app/api/access-management/additional-types";
import { searchDatasetsApi } from "@/app/api/discovery";

jest.mock("@/app/api/discovery/index");

describe("datasetEntitlements", () => {
  const mockedSearchDatasets = searchDatasetsApi as jest.MockedFunction<
    typeof searchDatasetsApi
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
      results: [
        { identifier: "1", title: "Dataset 1" } as SearchedDataset,
        { identifier: "2", title: "Dataset 2" } as SearchedDataset,
      ],
      count: 2,
    };

    mockedSearchDatasets.mockResolvedValue(mockApiResponse);

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

  it("should find dataset by identifier", async () => {
    const mockDataset: SearchedDataset = {
      identifier: "EGAD50000000276",
      title: "Test Dataset",
    } as SearchedDataset;

    mockedSearchDatasets.mockResolvedValue({
      results: [mockDataset],
      count: 1,
    });

    const result = await findDatasetByIdentifier("EGAD50000000276");

    expect(result).toEqual(mockDataset);
    expect(mockedSearchDatasets).toHaveBeenCalledWith({
      rows: 1,
      facets: [
        {
          source: "ckan",
          type: "DROPDOWN",
          key: "identifier",
          value: "EGAD50000000276",
        },
      ],
    });
  });
});
