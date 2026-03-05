// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { DiscoveryDatasetsSearchResponse } from "@/app/api/discovery/providers/types";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";

const mockCreateHeaders = jest.fn<() => Promise<Record<string, string>>>();
const mockUpsertLocalDiscoveryDatasets =
  jest.fn<(datasets: LocalDiscoveryDataset[]) => Promise<void>>();
const mockSearchDatasets =
  jest.fn<
    (
      _options: unknown,
      _headers: Record<string, string>
    ) => Promise<DiscoveryDatasetsSearchResponse>
  >();

jest.mock("@/app/api/shared/headers", () => ({
  createHeaders: mockCreateHeaders,
}));

jest.mock("@/app/api/discovery/local-store/factory", () => ({
  upsertLocalDiscoveryDatasets: mockUpsertLocalDiscoveryDatasets,
}));

jest.mock("@/app/api/discovery/providers/dds-discovery-provider", () => ({
  DdsDiscoveryProvider: jest.fn().mockImplementation(() => ({
    searchDatasets: mockSearchDatasets,
  })),
}));

import {
  seedLocalIndexFromDdsApi,
  upsertLocalIndexDatasetsApi,
} from "@/app/api/discovery/local-index";

describe("local-index APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("upsertLocalIndexDatasetsApi forwards datasets to local store", async () => {
    const datasets = [{ id: "d1", title: "Dataset 1" }];

    await upsertLocalIndexDatasetsApi(datasets);

    expect(mockUpsertLocalDiscoveryDatasets).toHaveBeenCalledWith(datasets);
  });

  test("seedLocalIndexFromDdsApi seeds valid id/title datasets from DDS", async () => {
    mockCreateHeaders.mockResolvedValueOnce({ Authorization: "Bearer token" });
    mockSearchDatasets.mockResolvedValueOnce({
      results: [
        { id: "d1", title: "Dataset 1", description: "A" },
        { id: "d2", title: "Dataset 2", description: "B" },
        { id: "", title: "Missing id", description: "C" },
        { id: "d4", title: "", description: "D" },
      ],
    });

    const count = await seedLocalIndexFromDdsApi({ query: "dataset" });

    expect(mockCreateHeaders).toHaveBeenCalled();
    expect(mockSearchDatasets).toHaveBeenCalledWith(
      { query: "dataset" },
      { Authorization: "Bearer token" }
    );
    expect(mockUpsertLocalDiscoveryDatasets).toHaveBeenCalledWith([
      { id: "d1", title: "Dataset 1" },
      { id: "d2", title: "Dataset 2" },
    ]);
    expect(count).toBe(2);
  });

  test("seedLocalIndexFromDdsApi handles empty results", async () => {
    mockCreateHeaders.mockResolvedValueOnce({});
    mockSearchDatasets.mockResolvedValueOnce({});

    const count = await seedLocalIndexFromDdsApi();

    expect(mockUpsertLocalDiscoveryDatasets).toHaveBeenCalledWith([]);
    expect(count).toBe(0);
  });
});
