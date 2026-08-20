// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export type HarvesterRunStatus = "success" | "partial" | "failed";

export type HarvesterRunError = {
  subjectId?: string;
  message: string;
  stack?: string;
};

export type HarvesterRunWarningType = "missingFields" | "healthDcatApCompliance";

export type HarvesterRunWarning = {
  subjectId: string;
  datasetTitle?: string;
  type: HarvesterRunWarningType;
  details: string[];
};

export type HarvesterSucceededDataset = {
  subjectId: string;
  datasetTitle?: string;
};

export interface HarvesterRunLog {
  runId: string;
  startedAt: string;
  finishedAt: string;
  source: { url?: string; path?: string };
  mode: "replace" | "append";
  status: HarvesterRunStatus;
  succeeded: number;
  failed: number;
  errors: HarvesterRunError[];
  warnings: HarvesterRunWarning[];
  succeededDatasets: HarvesterSucceededDataset[];
}

export type HarvesterRunSummary = Omit<
  HarvesterRunLog,
  "errors" | "warnings" | "succeededDatasets"
> & {
  errorCount: number;
  warningCount: number;
};

export interface HarvesterRunListResult {
  count: number;
  results: HarvesterRunSummary[];
}

export interface HarvesterLogsStore {
  ensureInitialized: () => Promise<void>;
  writeRunLog: (log: HarvesterRunLog) => Promise<void>;
  listRuns: (
    start: number,
    rows: number,
    status?: HarvesterRunStatus
  ) => Promise<HarvesterRunListResult>;
  retrieveRun: (runId: string) => Promise<HarvesterRunLog | null>;
}
