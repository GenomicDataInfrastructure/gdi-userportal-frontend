// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

describe("harvester-logs factory", () => {
  const originalEnv = {
    enabled: process.env.HARVEST_LOGGING_ENABLED,
    index: process.env.OPENSEARCH_HARVESTER_LOGS_INDEX,
  };

  afterEach(() => {
    if (originalEnv.enabled === undefined)
      delete process.env.HARVEST_LOGGING_ENABLED;
    else process.env.HARVEST_LOGGING_ENABLED = originalEnv.enabled;
    if (originalEnv.index === undefined)
      delete process.env.OPENSEARCH_HARVESTER_LOGS_INDEX;
    else process.env.OPENSEARCH_HARVESTER_LOGS_INDEX = originalEnv.index;
    jest.resetModules();
  });

  test("isHarvesterLoggingEnabled is false by default", async () => {
    delete process.env.HARVEST_LOGGING_ENABLED;

    const { isHarvesterLoggingEnabled } =
      await import("@/app/api/discovery/local-store/harvester-logs/factory");

    expect(isHarvesterLoggingEnabled()).toBe(false);
  });

  test("isHarvesterLoggingEnabled is true when set to 'true' (case-insensitive)", async () => {
    process.env.HARVEST_LOGGING_ENABLED = "True";

    const { isHarvesterLoggingEnabled } =
      await import("@/app/api/discovery/local-store/harvester-logs/factory");

    expect(isHarvesterLoggingEnabled()).toBe(true);
  });

  test("getHarvesterLogsStore returns a cached store", async () => {
    const { getHarvesterLogsStore } =
      await import("@/app/api/discovery/local-store/harvester-logs/factory");

    const store1 = getHarvesterLogsStore();
    const store2 = getHarvesterLogsStore();

    expect(store2).toBe(store1);
  });

  test("writeHarvesterRunLog forwards to the underlying store", async () => {
    const { getHarvesterLogsStore, writeHarvesterRunLog } =
      await import("@/app/api/discovery/local-store/harvester-logs/factory");

    const store = getHarvesterLogsStore();
    const spy = jest.spyOn(store, "writeRunLog").mockResolvedValueOnce();
    const log = {
      runId: "run-1",
      startedAt: "2026-08-18T10:00:00.000Z",
      finishedAt: "2026-08-18T10:00:05.000Z",
      source: { url: "https://example.org/catalogue.rdf" },
      mode: "replace" as const,
      status: "success" as const,
      succeeded: 1,
      failed: 0,
      errors: [],
      warnings: [],
      succeededDatasets: [],
    };

    await writeHarvesterRunLog(log);

    expect(spy).toHaveBeenCalledWith(log);
  });

  test("listHarvesterRuns forwards to the underlying store", async () => {
    const { getHarvesterLogsStore, listHarvesterRuns } =
      await import("@/app/api/discovery/local-store/harvester-logs/factory");

    const store = getHarvesterLogsStore();
    const spy = jest
      .spyOn(store, "listRuns")
      .mockResolvedValueOnce({ count: 0, results: [] });

    await listHarvesterRuns(0, 20);

    expect(spy).toHaveBeenCalledWith(0, 20, undefined);
  });

  test("retrieveHarvesterRun forwards to the underlying store", async () => {
    const { getHarvesterLogsStore, retrieveHarvesterRun } =
      await import("@/app/api/discovery/local-store/harvester-logs/factory");

    const store = getHarvesterLogsStore();
    const spy = jest.spyOn(store, "retrieveRun").mockResolvedValueOnce(null);

    await retrieveHarvesterRun("run-1");

    expect(spy).toHaveBeenCalledWith("run-1");
  });
});
