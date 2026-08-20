// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { OpenSearchHarvesterLogsStore } from "@/app/api/discovery/local-store/harvester-logs/opensearch-harvester-logs-store";
import { HarvesterRunLog } from "@/app/api/discovery/local-store/harvester-logs/types";

const mockClient = {
  put: jest.fn<(_url: string, _body: unknown) => Promise<unknown>>(),
  post: jest.fn<
    (_url: string, _body?: unknown, _config?: unknown) => Promise<{ data: any }>
  >(),
  get: jest.fn<(_url: string) => Promise<{ data: any }>>(),
};

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn<() => typeof mockClient>(() => mockClient),
    isAxiosError: jest.fn((error: any) => Boolean(error?.isAxiosError)),
  },
}));

describe("OpenSearchHarvesterLogsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.put.mockResolvedValue({});
    mockClient.post.mockResolvedValue({ data: {} });
    mockClient.get.mockResolvedValue({ data: {} });
  });

  const createStore = () =>
    new OpenSearchHarvesterLogsStore({
      baseUrl: "https://localhost:9200",
      indexName: "harvester_logs",
      username: "elastic",
      password: "secret",
      insecureTls: true,
    });

  const sampleLog: HarvesterRunLog = {
    runId: "run-1",
    startedAt: "2026-08-18T10:00:00.000Z",
    finishedAt: "2026-08-18T10:00:05.000Z",
    source: { url: "https://example.org/catalogue.rdf" },
    mode: "replace",
    status: "success",
    succeeded: 5,
    failed: 0,
    errors: [],
    warnings: [],
    succeededDatasets: [],
  };

  test("ensureInitialized creates index once", async () => {
    const store = createStore();

    await store.ensureInitialized();
    await store.ensureInitialized();

    expect(mockClient.put).toHaveBeenCalledTimes(1);
    expect(mockClient.put).toHaveBeenCalledWith(
      "/harvester_logs",
      expect.any(Object)
    );
  });

  test("ensureInitialized swallows already-exists error", async () => {
    const store = createStore();
    mockClient.put.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: { error: { type: "resource_already_exists_exception" } },
      },
    });

    await expect(store.ensureInitialized()).resolves.toBeUndefined();
  });

  test("writeRunLog puts the document under the run id", async () => {
    const store = createStore();

    await store.writeRunLog(sampleLog);

    expect(mockClient.put).toHaveBeenCalledWith(
      "/harvester_logs/_doc/run-1",
      sampleLog
    );
  });

  test("listRuns returns count and mapped summaries", async () => {
    const store = createStore();
    mockClient.post.mockResolvedValueOnce({
      data: {
        hits: {
          total: { value: 1 },
          hits: [{ _id: "run-1", _source: sampleLog }],
        },
      },
    });

    const result = await store.listRuns(0, 20);

    expect(result.count).toBe(1);
    expect(result.results).toEqual([
      {
        runId: "run-1",
        startedAt: sampleLog.startedAt,
        finishedAt: sampleLog.finishedAt,
        source: sampleLog.source,
        mode: sampleLog.mode,
        status: sampleLog.status,
        succeeded: sampleLog.succeeded,
        failed: sampleLog.failed,
        errorCount: 0,
        warningCount: 0,
      },
    ]);
  });

  test("listRuns requests the search backend with succeededDatasets excluded", async () => {
    const store = createStore();
    mockClient.post.mockResolvedValueOnce({
      data: { hits: { total: { value: 0 }, hits: [] } },
    });

    await store.listRuns(0, 20);

    expect(mockClient.post).toHaveBeenCalledWith(
      "/harvester_logs/_search",
      expect.objectContaining({
        _source: { excludes: ["succeededDatasets"] },
      })
    );
  });

  test("listRuns omits succeededDatasets from the mapped summary even when present", async () => {
    const store = createStore();
    const logWithSucceededDatasets: HarvesterRunLog = {
      ...sampleLog,
      succeededDatasets: [{ subjectId: "d1", datasetTitle: "Dataset 1" }],
    };
    mockClient.post.mockResolvedValueOnce({
      data: {
        hits: {
          total: { value: 1 },
          hits: [{ _id: "run-1", _source: logWithSucceededDatasets }],
        },
      },
    });

    const result = await store.listRuns(0, 20);

    expect(result.results[0]).not.toHaveProperty("succeededDatasets");
  });

  test("retrieveRun returns the document source", async () => {
    const store = createStore();
    mockClient.get.mockResolvedValueOnce({
      data: { _id: "run-1", _source: sampleLog },
    });

    await expect(store.retrieveRun("run-1")).resolves.toEqual(sampleLog);
  });

  test("retrieveRun includes succeededDatasets for a single run", async () => {
    const store = createStore();
    const logWithSucceededDatasets: HarvesterRunLog = {
      ...sampleLog,
      succeededDatasets: [{ subjectId: "d1", datasetTitle: "Dataset 1" }],
    };
    mockClient.get.mockResolvedValueOnce({
      data: { _id: "run-1", _source: logWithSucceededDatasets },
    });

    await expect(store.retrieveRun("run-1")).resolves.toEqual(
      logWithSucceededDatasets
    );
  });

  test("retrieveRun returns null on 404", async () => {
    const store = createStore();
    mockClient.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 },
    });

    await expect(store.retrieveRun("missing")).resolves.toBeNull();
  });
});
