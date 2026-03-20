// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { buildDdsSearchedDataset } from "@/app/api/discovery/test-utils/fixtures";
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
    ) => Promise<{ results?: Record<string, unknown>[] }>
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
    const datasets = [
      { id: "d1", title: "Dataset 1", publishers: [], hdab: [], creators: [] },
    ];

    await upsertLocalIndexDatasetsApi(datasets);

    expect(mockUpsertLocalDiscoveryDatasets).toHaveBeenCalledWith(datasets);
  });

  test("seedLocalIndexFromDdsApi seeds valid id/title datasets from DDS", async () => {
    mockCreateHeaders.mockResolvedValueOnce({ Authorization: "Bearer token" });
    mockSearchDatasets.mockResolvedValueOnce({
      results: [
        buildDdsSearchedDataset(),
        buildDdsSearchedDataset({
          id: "d2",
          title: "Dataset 2",
          description: "B",
          createdAt: undefined,
          modifiedAt: undefined,
          version: undefined,
          hasVersions: undefined,
          themes: undefined,
          keywords: undefined,
          temporalCoverage: undefined,
          accessRights: undefined,
          conformsTo: undefined,
          numberOfUniqueIndividuals: undefined,
          distributionsCount: undefined,
          maxTypicalAge: undefined,
          minTypicalAge: undefined,
          publishers: [],
        }),
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
        themes: [{ value: "theme-1", label: "Theme 1" }],
        keywords: ["keyword-1"],
        temporalCoverage: {
          start: "2022-01-01T00:00:00.000Z",
          end: "2023-01-01T00:00:00.000Z",
        },
        accessRights: { value: "public", label: "Public" },
        conformsTo: [{ value: "spec-1", label: "Spec 1" }],
        numberOfUniqueIndividuals: 25000,
        distributionsCount: 4,
        maxTypicalAge: 95,
        minTypicalAge: 18,
        publishers: [{ name: "DDS Publisher" }],
        hdab: [],
        creators: [],
        publisherType: undefined,
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
        themes: undefined,
        keywords: undefined,
        temporalCoverage: undefined,
        accessRights: undefined,
        conformsTo: undefined,
        numberOfRecords: undefined,
        numberOfUniqueIndividuals: undefined,
        distributionsCount: undefined,
        maxTypicalAge: undefined,
        minTypicalAge: undefined,
        publishers: [],
        hdab: [],
        creators: [],
        publisherType: undefined,
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
      {
        id: "d1",
        title: "Dataset 1",
        description: "Desc 1",
        publishers: [],
        hdab: [],
        creators: [],
      },
      {
        id: "d2",
        title: "Dataset 2",
        description: "Desc 2",
        publishers: [],
        hdab: [],
        creators: [],
      },
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

  test("harvestLocalIndexFromDcatUrlApi wraps authorization failures", async () => {
    mockGetAuthorizationHeaderIfConfigured.mockRejectedValueOnce(
      new Error("token lookup failed")
    );

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to prepare authorization for harvesting https://example.org/catalogue.rdf: token lookup failed"
    );
  });

  test("harvestLocalIndexFromDcatUrlApi wraps harvest failures", async () => {
    mockGetAuthorizationHeaderIfConfigured.mockResolvedValueOnce({});
    mockHarvestFromUrl.mockRejectedValueOnce(new Error("download failed"));

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to harvest datasets from https://example.org/catalogue.rdf: download failed"
    );
  });

  test("harvestLocalIndexFromDcatUrlApi wraps clear failures", async () => {
    mockGetAuthorizationHeaderIfConfigured.mockResolvedValueOnce({});
    mockHarvestFromUrl.mockResolvedValueOnce([
      { id: "d1", title: "Dataset 1", publishers: [], hdab: [], creators: [] },
    ]);
    mockClearLocalDiscoveryDatasets.mockRejectedValueOnce(
      new Error("clear failed")
    );

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to clear the local discovery index before importing https://example.org/catalogue.rdf: clear failed"
    );
  });

  test("harvestLocalIndexFromDcatUrlApi wraps indexing failures", async () => {
    mockGetAuthorizationHeaderIfConfigured.mockResolvedValueOnce({});
    mockHarvestFromUrl.mockResolvedValueOnce([
      { id: "d1", title: "Dataset 1", publishers: [], hdab: [], creators: [] },
      { id: "d2", title: "Dataset 2", publishers: [], hdab: [], creators: [] },
    ]);
    mockUpsertLocalDiscoveryDatasets.mockRejectedValueOnce(
      new Error("bulk failed")
    );

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to index 2 harvested datasets from https://example.org/catalogue.rdf: bulk failed"
    );
  });
});
