// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { buildDdsSearchedDataset } from "@/app/api/discovery/test-utils/fixtures";
import {
  LocalDiscoveryAiModel,
  LocalDiscoveryDataset,
} from "@/app/api/discovery/local-store/types";
import { HarvestCollectors } from "@/app/api/discovery/harvester/dcat-harvester-service";

type CatalogueHarvestResult = {
  datasets: LocalDiscoveryDataset[];
  aiModels: LocalDiscoveryAiModel[];
};

const mockCreateHeaders = jest.fn<() => Promise<Record<string, string>>>();
const mockUpsertLocalDiscoveryDatasets =
  jest.fn<(datasets: LocalDiscoveryDataset[]) => Promise<void>>();
const mockClearLocalDiscoveryDatasets = jest.fn<() => Promise<void>>();
const mockUpsertLocalAiModels =
  jest.fn<(aiModels: LocalDiscoveryAiModel[]) => Promise<void>>();
const mockClearLocalAiModels = jest.fn<() => Promise<void>>();
const mockSearchDatasets =
  jest.fn<
    (
      _options: unknown,
      _headers: Record<string, string>
    ) => Promise<{ results?: Record<string, unknown>[] }>
  >();
const mockHarvestFromUrl = jest.fn<
  (
    url: string,
    options?: {
      headers?: Record<string, string>;
      contentType?: string;
      includeAiModels?: boolean;
    },
    collectors?: HarvestCollectors
  ) => Promise<CatalogueHarvestResult>
>();
const mockHarvestFromFilePath =
  jest.fn<
    (
      filePath: string,
      collectors?: HarvestCollectors,
      contentType?: string,
      includeAiModels?: boolean
    ) => Promise<CatalogueHarvestResult>
  >();
const mockGetAuthorizationHeaderIfConfigured =
  jest.fn<() => Promise<Record<string, string>>>();
const mockWriteHarvesterRunLog = jest.fn<(log: unknown) => Promise<void>>();
const mockIsHarvesterLoggingEnabled = jest.fn<() => boolean>();
const mockContentConfig = { enableAiModel: true };

jest.mock("@/app/api/shared/headers", () => ({
  createHeaders: mockCreateHeaders,
}));

jest.mock("@/app/api/discovery/local-store/harvester-logs/factory", () => ({
  writeHarvesterRunLog: mockWriteHarvesterRunLog,
  isHarvesterLoggingEnabled: mockIsHarvesterLoggingEnabled,
}));

jest.mock("@/app/api/discovery/local-store/factory", () => ({
  clearLocalDiscoveryDatasets: mockClearLocalDiscoveryDatasets,
  upsertLocalDiscoveryDatasets: mockUpsertLocalDiscoveryDatasets,
}));

jest.mock("@/app/api/discovery/local-store/ai-model-factory", () => ({
  clearLocalAiModels: mockClearLocalAiModels,
  upsertLocalAiModels: mockUpsertLocalAiModels,
}));

jest.mock("@/config/contentConfig", () => ({
  __esModule: true,
  default: mockContentConfig,
}));

jest.mock("@/app/api/discovery/providers/dds-discovery-provider", () => ({
  DdsDiscoveryProvider: jest.fn().mockImplementation(() => ({
    searchDatasets: mockSearchDatasets,
  })),
}));

jest.mock("@/app/api/discovery/harvester/dcat-harvester-service", () => ({
  dcatHarvesterService: {
    harvestFromUrl: mockHarvestFromUrl,
    harvestFromFilePath: mockHarvestFromFilePath,
  },
}));

jest.mock("@/app/api/discovery/harvester/oidc-auth.service", () => ({
  oidcAuthService: {
    getAuthorizationHeaderIfConfigured: mockGetAuthorizationHeaderIfConfigured,
  },
}));

import {
  harvestLocalIndexFromDcatFileApi,
  harvestLocalIndexFromDcatUrlApi,
  seedLocalIndexFromDdsApi,
  upsertLocalIndexDatasetsApi,
} from "@/app/api/discovery/local-index";

const resultWithDatasets = (
  datasets: LocalDiscoveryDataset[]
): CatalogueHarvestResult => ({ datasets, aiModels: [] });

describe("local-index APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContentConfig.enableAiModel = true;
    mockIsHarvesterLoggingEnabled.mockReturnValue(false);
    mockGetAuthorizationHeaderIfConfigured.mockResolvedValue({});
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
    mockHarvestFromUrl.mockResolvedValueOnce(resultWithDatasets(harvested));

    const count = await harvestLocalIndexFromDcatUrlApi(
      "https://example.org/catalogue.rdf"
    );

    expect(mockHarvestFromUrl).toHaveBeenCalledWith(
      "https://example.org/catalogue.rdf",
      { headers: {}, includeAiModels: true },
      {
        mappingErrors: [],
        shaclViolations: undefined,
      }
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

  test("harvestLocalIndexFromDcatUrlApi fetches and parses the RDF source only once for both Datasets and AI Models", async () => {
    mockHarvestFromUrl.mockResolvedValueOnce(resultWithDatasets([]));

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    expect(mockHarvestFromUrl).toHaveBeenCalledTimes(1);
  });

  test("harvestLocalIndexFromDcatUrlApi also indexes AI Models harvested alongside Datasets", async () => {
    const harvestedAiModels = [
      {
        id: "ai-model-1",
        title: "Model 1",
        description: "Desc",
        entityType: "AI_MODEL" as const,
        publishers: [],
        creators: [],
      },
    ];
    mockHarvestFromUrl.mockResolvedValueOnce({
      datasets: [],
      aiModels: harvestedAiModels,
    });

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    expect(mockClearLocalAiModels).toHaveBeenCalled();
    expect(mockUpsertLocalAiModels).toHaveBeenCalledWith(harvestedAiModels);
  });

  test("harvestLocalIndexFromDcatUrlApi does not index AI Models when the feature is disabled", async () => {
    mockContentConfig.enableAiModel = false;
    mockHarvestFromUrl.mockResolvedValueOnce({
      datasets: [],
      aiModels: [
        {
          id: "ai-model-1",
          title: "Model 1",
          entityType: "AI_MODEL",
          publishers: [],
          creators: [],
        },
      ],
    });

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    expect(mockClearLocalAiModels).not.toHaveBeenCalled();
    expect(mockUpsertLocalAiModels).not.toHaveBeenCalled();
  });

  test("harvestLocalIndexFromDcatUrlApi fails when enabled AI Model indexing fails", async () => {
    mockHarvestFromUrl.mockResolvedValueOnce({
      datasets: [],
      aiModels: [
        {
          id: "ai-model-1",
          title: "Model 1",
          entityType: "AI_MODEL",
          publishers: [],
          creators: [],
        },
      ],
    });
    mockClearLocalAiModels.mockRejectedValueOnce(new Error("clear failed"));

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to index 1 harvested AI Models from https://example.org/catalogue.rdf: clear failed"
    );
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
    mockHarvestFromUrl.mockRejectedValueOnce(new Error("download failed"));

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to harvest catalogue from https://example.org/catalogue.rdf: download failed"
    );
  });

  test("harvestLocalIndexFromDcatUrlApi wraps clear failures", async () => {
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );
    mockClearLocalDiscoveryDatasets.mockRejectedValueOnce(
      new Error("clear failed")
    );

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to clear the local discovery index before importing https://example.org/catalogue.rdf: clear failed"
    );
  });

  test("harvestLocalIndexFromDcatUrlApi skips clearing the index in append mode", async () => {
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf", {
      mode: "append",
    });

    expect(mockClearLocalDiscoveryDatasets).not.toHaveBeenCalled();
    expect(mockUpsertLocalDiscoveryDatasets).toHaveBeenCalled();
  });

  test("harvestLocalIndexFromDcatUrlApi wraps indexing failures", async () => {
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
        {
          id: "d2",
          title: "Dataset 2",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );
    mockUpsertLocalDiscoveryDatasets.mockRejectedValueOnce(
      new Error("bulk failed")
    );

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to index 2 harvested datasets from https://example.org/catalogue.rdf: bulk failed"
    );
  });

  test("harvestLocalIndexFromDcatUrlApi does not write a run log when logging is disabled", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(false);
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    expect(mockWriteHarvesterRunLog).not.toHaveBeenCalled();
  });

  test("harvestLocalIndexFromDcatUrlApi skips SHACL validation (passes no collector) when logging is disabled", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(false);
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    expect(mockHarvestFromUrl).toHaveBeenCalledWith(
      "https://example.org/catalogue.rdf",
      { headers: {}, includeAiModels: true },
      {
        mappingErrors: [],
        shaclViolations: undefined,
      }
    );
  });

  test("harvestLocalIndexFromDcatUrlApi passes explicit content type", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(false);
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue", {
      contentType: "text/turtle",
    });

    expect(mockHarvestFromUrl).toHaveBeenCalledWith(
      "https://example.org/catalogue",
      { headers: {}, contentType: "text/turtle", includeAiModels: true },
      {
        mappingErrors: [],
        shaclViolations: undefined,
      }
    );
  });

  test("harvestLocalIndexFromDcatUrlApi runs SHACL validation (passes a collector) when logging is enabled", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    expect(mockHarvestFromUrl).toHaveBeenCalledWith(
      "https://example.org/catalogue.rdf",
      { headers: {}, includeAiModels: true },
      { mappingErrors: [], shaclViolations: [] }
    );
  });

  test("harvestLocalIndexFromDcatUrlApi writes a success run log when logging is enabled", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
        {
          id: "d2",
          title: "Dataset 2",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    expect(mockWriteHarvesterRunLog).toHaveBeenCalledTimes(1);
    const loggedRun = mockWriteHarvesterRunLog.mock.calls[0][0] as {
      status: string;
      succeeded: number;
      failed: number;
      source: { url?: string };
      errors: unknown[];
      succeededDatasets: { subjectId: string; datasetTitle?: string }[];
    };
    expect(loggedRun.status).toBe("success");
    expect(loggedRun.succeeded).toBe(2);
    expect(loggedRun.failed).toBe(0);
    expect(loggedRun.source).toEqual({
      url: "https://example.org/catalogue.rdf",
    });
    expect(loggedRun.errors).toEqual([]);
    expect(loggedRun.succeededDatasets).toEqual([
      { subjectId: "d1", datasetTitle: "Dataset 1" },
      { subjectId: "d2", datasetTitle: "Dataset 2" },
    ]);
  });

  test("harvestLocalIndexFromDcatUrlApi includes harvested AI Models in the run count", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockHarvestFromUrl.mockResolvedValueOnce({
      datasets: [],
      aiModels: [
        {
          id: "ai-model-1",
          title: "Model 1",
          entityType: "AI_MODEL",
          publishers: [],
          creators: [],
        },
      ],
    });

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    const loggedRun = mockWriteHarvesterRunLog.mock.calls[0][0] as {
      status: string;
      succeeded: number;
      failed: number;
    };
    expect(loggedRun).toMatchObject({
      status: "success",
      succeeded: 1,
      failed: 0,
    });
  });

  test("harvestLocalIndexFromDcatUrlApi reports AI Model mapping errors", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockHarvestFromUrl.mockImplementationOnce(
      async (_url, _options, collectors) => {
        collectors?.mappingErrors.push({
          scope: "aiModel",
          subjectId: "ai-model-1",
          message: "malformed AI Model",
        });
        return { datasets: [], aiModels: [] };
      }
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    const loggedRun = mockWriteHarvesterRunLog.mock.calls[0][0] as {
      status: string;
      failed: number;
      errors: { subjectId?: string; message: string }[];
    };
    expect(loggedRun).toMatchObject({ status: "failed", failed: 1 });
    expect(loggedRun.errors).toEqual([
      { subjectId: "ai-model-1", message: "malformed AI Model" },
    ]);
  });

  test("harvestLocalIndexFromDcatUrlApi logs field warnings for datasets missing required fields", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          identifier: "d1",
          title: "Complete Dataset",
          description: "Has everything",
          publishers: [{ name: "Org" }],
          hdab: [],
          creators: [],
        },
        {
          id: "d2",
          title: "Incomplete Dataset",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    const loggedRun = mockWriteHarvesterRunLog.mock.calls[0][0] as {
      warnings: {
        subjectId: string;
        datasetTitle?: string;
        type: string;
        details: string[];
      }[];
    };
    expect(loggedRun.warnings).toEqual([
      {
        subjectId: "d2",
        datasetTitle: "Incomplete Dataset",
        type: "missingFields",
        details: ["description", "identifier", "publisher"],
      },
    ]);
  });

  test("harvestLocalIndexFromDcatUrlApi logs distribution warnings grouped by dataset", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockHarvestFromUrl.mockImplementationOnce(
      async (_url, _options, collectors) => {
        collectors?.mappingErrors.push(
          {
            scope: "distribution",
            datasetId: "d1",
            distributionId: "https://example.org/distributions/bad",
            message: "malformed distribution field",
          },
          {
            scope: "distribution",
            datasetId: "d1",
            distributionId: "https://example.org/distributions/worse",
            message: "missing accessURL",
          }
        );
        return resultWithDatasets([
          {
            id: "d1",
            identifier: "d1",
            title: "Dataset 1",
            description: "Has everything",
            publishers: [{ name: "Org" }],
            hdab: [],
            creators: [],
          },
        ]);
      }
    );

    await harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf");

    const loggedRun = mockWriteHarvesterRunLog.mock.calls[0][0] as {
      warnings: {
        subjectId: string;
        type: string;
        details: string[];
      }[];
    };
    expect(loggedRun.warnings).toEqual([
      {
        subjectId: "d1",
        type: "distributionIssue",
        details: [
          "https://example.org/distributions/bad: malformed distribution field",
          "https://example.org/distributions/worse: missing accessURL",
        ],
      },
    ]);
  });

  test("harvestLocalIndexFromDcatUrlApi writes a failed run log when the run throws, and still throws", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockHarvestFromUrl.mockRejectedValueOnce(new Error("download failed"));

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).rejects.toThrow("download failed");

    expect(mockWriteHarvesterRunLog).toHaveBeenCalledTimes(1);
    const loggedRun = mockWriteHarvesterRunLog.mock.calls[0][0] as {
      status: string;
      succeeded: number;
      failed: number;
      errors: { message: string }[];
    };
    expect(loggedRun.status).toBe("failed");
    expect(loggedRun.succeeded).toBe(0);
    expect(loggedRun.failed).toBe(1);
    expect(loggedRun.errors[0].message).toContain("download failed");
  });

  test("harvestLocalIndexFromDcatUrlApi does not fail the run when writing the log itself fails", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockHarvestFromUrl.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );
    mockWriteHarvesterRunLog.mockRejectedValueOnce(
      new Error("opensearch down")
    );

    await expect(
      harvestLocalIndexFromDcatUrlApi("https://example.org/catalogue.rdf")
    ).resolves.toBe(1);
  });

  test("harvestLocalIndexFromDcatFileApi harvests and upserts datasets, clearing first in replace mode", async () => {
    const harvested = [
      { id: "d1", title: "Dataset 1", publishers: [], hdab: [], creators: [] },
    ];
    mockHarvestFromFilePath.mockResolvedValueOnce(
      resultWithDatasets(harvested)
    );

    const count = await harvestLocalIndexFromDcatFileApi("no-data-dict.rdf");

    expect(mockHarvestFromFilePath).toHaveBeenCalledWith(
      "no-data-dict.rdf",
      {
        mappingErrors: [],
        shaclViolations: undefined,
      },
      undefined,
      true
    );
    expect(mockClearLocalDiscoveryDatasets).toHaveBeenCalled();
    expect(
      mockClearLocalDiscoveryDatasets.mock.invocationCallOrder[0]
    ).toBeLessThan(
      mockUpsertLocalDiscoveryDatasets.mock.invocationCallOrder[0]
    );
    expect(mockUpsertLocalDiscoveryDatasets).toHaveBeenCalledWith(harvested);
    expect(count).toBe(1);
  });

  test("harvestLocalIndexFromDcatFileApi fetches and parses the file only once for both Datasets and AI Models", async () => {
    mockHarvestFromFilePath.mockResolvedValueOnce(resultWithDatasets([]));

    await harvestLocalIndexFromDcatFileApi("no-data-dict.rdf");

    expect(mockHarvestFromFilePath).toHaveBeenCalledTimes(1);
  });

  test("harvestLocalIndexFromDcatFileApi also indexes AI Models harvested alongside Datasets", async () => {
    mockHarvestFromFilePath.mockResolvedValueOnce({
      datasets: [],
      aiModels: [
        {
          id: "ai-model-1",
          title: "Model 1",
          description: "Desc",
          entityType: "AI_MODEL" as const,
          publishers: [],
          creators: [],
        },
      ],
    });

    await harvestLocalIndexFromDcatFileApi("no-data-dict.rdf");

    expect(mockClearLocalAiModels).toHaveBeenCalled();
    expect(mockUpsertLocalAiModels).toHaveBeenCalled();
  });

  test("harvestLocalIndexFromDcatFileApi passes explicit content type", async () => {
    const harvested = [
      { id: "d1", title: "Dataset 1", publishers: [], hdab: [], creators: [] },
    ];
    mockHarvestFromFilePath.mockResolvedValueOnce(
      resultWithDatasets(harvested)
    );

    await harvestLocalIndexFromDcatFileApi("uploaded-catalogue", {
      contentType: "text/turtle",
    });

    expect(mockHarvestFromFilePath).toHaveBeenCalledWith(
      "uploaded-catalogue",
      {
        mappingErrors: [],
        shaclViolations: undefined,
      },
      "text/turtle",
      true
    );
  });

  test("harvestLocalIndexFromDcatFileApi skips clearing the index in append mode", async () => {
    mockHarvestFromFilePath.mockResolvedValueOnce(
      resultWithDatasets([
        {
          id: "d1",
          title: "Dataset 1",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    );

    await harvestLocalIndexFromDcatFileApi("no-data-dict.rdf", {
      mode: "append",
    });

    expect(mockClearLocalDiscoveryDatasets).not.toHaveBeenCalled();
    expect(mockUpsertLocalDiscoveryDatasets).toHaveBeenCalled();
  });

  test("harvestLocalIndexFromDcatFileApi wraps harvest failures", async () => {
    mockHarvestFromFilePath.mockRejectedValueOnce(new Error("read failed"));

    await expect(
      harvestLocalIndexFromDcatFileApi("missing.rdf")
    ).rejects.toThrow(
      "Failed to harvest catalogue from missing.rdf: read failed"
    );
    expect(mockClearLocalDiscoveryDatasets).not.toHaveBeenCalled();
    expect(mockUpsertLocalDiscoveryDatasets).not.toHaveBeenCalled();
  });

  test("harvestLocalIndexFromDcatFileApi wraps non-Error harvest failures", async () => {
    mockHarvestFromFilePath.mockRejectedValueOnce("disk offline");

    await expect(
      harvestLocalIndexFromDcatFileApi("missing.rdf")
    ).rejects.toThrow(
      "Failed to harvest catalogue from missing.rdf: disk offline"
    );
  });
});
