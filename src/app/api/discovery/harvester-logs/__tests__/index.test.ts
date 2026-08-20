// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import {
  HarvesterRunListResult,
  HarvesterRunLog,
  HarvesterRunStatus,
} from "@/app/api/discovery/local-store/harvester-logs/types";

const mockListHarvesterRuns =
  jest.fn<
    (
      start: number,
      rows: number,
      status?: HarvesterRunStatus
    ) => Promise<HarvesterRunListResult>
  >();
const mockRetrieveHarvesterRun =
  jest.fn<(runId: string) => Promise<HarvesterRunLog | null>>();

jest.mock("@/app/api/discovery/local-store/harvester-logs/factory", () => ({
  listHarvesterRuns: mockListHarvesterRuns,
  retrieveHarvesterRun: mockRetrieveHarvesterRun,
}));

import {
  getHarvesterRunApi,
  listHarvesterRunsApi,
} from "@/app/api/discovery/harvester-logs";

describe("harvester-logs read API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listHarvesterRunsApi forwards pagination and returns the result", async () => {
    const result: HarvesterRunListResult = { count: 0, results: [] };
    mockListHarvesterRuns.mockResolvedValueOnce(result);

    await expect(listHarvesterRunsApi(0, 20)).resolves.toBe(result);
    expect(mockListHarvesterRuns).toHaveBeenCalledWith(0, 20, undefined);
  });

  test("listHarvesterRunsApi forwards the status filter", async () => {
    const result: HarvesterRunListResult = { count: 0, results: [] };
    mockListHarvesterRuns.mockResolvedValueOnce(result);

    await expect(listHarvesterRunsApi(0, 20, "failed")).resolves.toBe(result);
    expect(mockListHarvesterRuns).toHaveBeenCalledWith(0, 20, "failed");
  });

  test("getHarvesterRunApi forwards the run id and returns the result", async () => {
    mockRetrieveHarvesterRun.mockResolvedValueOnce(null);

    await expect(getHarvesterRunApi("run-1")).resolves.toBeNull();
    expect(mockRetrieveHarvesterRun).toHaveBeenCalledWith("run-1");
  });
});
