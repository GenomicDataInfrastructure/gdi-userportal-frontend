// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { DiscoveryDatasetsSearchResponse } from "@/app/api/discovery/providers/types";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";

const mockCreateHeaders = jest.fn<() => Promise<Record<string, string>>>();
const mockUpsertLocalDiscoveryDatasets =
  jest.fn<(datasets: LocalDiscoveryDataset[]) => Promise<void>>();
const mockClearLocalDiscoveryDatasets = jest.fn<() => Promise<void>>();
const mockSearchDatasets =
  jest.fn<
    (
      _options: unknown,
      _headers: Record<string, string>
    ) => Promise<DiscoveryDatasetsSearchResponse>
  >();
const mockHarvestFromUrl =
  jest.fn<
    (
      url: string,
      options?: { headers?: Record<string, string> }
    ) => Promise<LocalDiscoveryDataset[]>
  >();
const mockGetAuthorizationHeaderIfConfigured =
  jest.fn<() => Promise<Record<string, string>>>();

jest.mock("@/app/api/shared/headers", () => ({
  createHeaders: mockCreateHeaders,
}));

jest.mock("@/app/api/discovery/local-store/factory", () => ({
  clearLocalDiscoveryDatasets: mockClearLocalDiscoveryDatasets,
  upsertLocalDiscoveryDatasets: mockUpsertLocalDiscoveryDatasets,
}));

jest.mock("@/app/api/discovery/providers/dds-discovery-provider", () => ({
  DdsDiscoveryProvider: jest.fn().mockImplementation(() => ({
    searchDatasets: mockSearchDatasets,
  })),
}));

jest.mock("@/app/api/discovery/harvester/dcat-harvester-service", () => ({
  dcatHarvesterService: {
    harvestFromUrl: mockHarvestFromUrl,
  },
}));

jest.mock("@/app/api/discovery/harvester/oidc-auth.service", () => ({
  oidcAuthService: {
    getAuthorizationHeaderIfConfigured: mockGetAuthorizationHeaderIfConfigured,
  },
}));

import {
  harvestLocalIndexFromDcatUrlApi,
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
        {
          id: "d1",
          title: "Dataset 1",
          description: "A",
          createdAt: "2024-01-15T00:00:00.000Z",
          modifiedAt: "2024-03-10T00:00:00.000Z",
          version: "1.0.0",
          hasVersions: [{ value: "v1", label: "Version 1" }],
        },
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
      {
        id: "d1",
        identifier: undefined,
        title: "Dataset 1",
        description: "A",
        catalogue: undefined,
        languages: undefined,
        createdAt: "2024-01-15T00:00:00.000Z",
        modifiedAt: "2024-03-10T00:00:00.000Z",
        version: "1.0.0",
        hasVersions: [{ value: "v1", label: "Version 1" }],
        versionNotes: undefined,
      },
      {
        id: "d2",
        identifier: undefined,
        title: "Dataset 2",
        description: "B",
        catalogue: undefined,
        languages: undefined,
        createdAt: undefined,
        modifiedAt: undefined,
        version: undefined,
        hasVersions: undefined,
        versionNotes: undefined,
      },
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

  test("harvestLocalIndexFromDcatUrlApi harvests and upserts datasets", async () => {
    const harvested = [
      { id: "d1", title: "Dataset 1", description: "Desc 1" },
      { id: "d2", title: "Dataset 2", description: "Desc 2" },
    ];
    mockGetAuthorizationHeaderIfConfigured.mockResolvedValueOnce({});
    mockHarvestFromUrl.mockResolvedValueOnce(harvested);

    const count = await harvestLocalIndexFromDcatUrlApi(
      "https://example.org/catalogue.rdf"
    );

    expect(mockHarvestFromUrl).toHaveBeenCalledWith(
      "https://example.org/catalogue.rdf",
      { headers: {} }
    );
    expect(mockClearLocalDiscoveryDatasets).toHaveBeenCalled();
    expect(
      mockClearLocalDiscoveryDatasets.mock.invocationCallOrder[0]
    ).toBeLessThan(
      mockUpsertLocalDiscoveryDatasets.mock.invocationCallOrder[0]
    );
    expect(mockUpsertLocalDiscoveryDatasets).toHaveBeenCalledWith(harvested);
    expect(count).toBe(2);
  });
});
