// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import {
  listHarvesterRuns,
  retrieveHarvesterRun,
} from "@/app/api/discovery/local-store/harvester-logs/factory";
import {
  HarvesterRunListResult,
  HarvesterRunLog,
  HarvesterRunStatus,
} from "@/app/api/discovery/local-store/harvester-logs/types";

export const listHarvesterRunsApi = async (
  start: number,
  rows: number,
  status?: HarvesterRunStatus
): Promise<HarvesterRunListResult> => {
  return listHarvesterRuns(start, rows, status);
};

export const getHarvesterRunApi = async (
  runId: string
): Promise<HarvesterRunLog | null> => {
  return retrieveHarvesterRun(runId);
};
