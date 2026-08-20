// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  HarvesterRunLog,
  HarvesterRunStatus,
} from "@/app/api/discovery/local-store/harvester-logs/types";

export const createHarvesterLogsIndexMappings = () => ({
  mappings: {
    properties: {
      runId: { type: "keyword" },
      startedAt: { type: "date" },
      finishedAt: { type: "date" },
      source: {
        type: "object",
        properties: {
          url: { type: "keyword" },
          path: { type: "keyword" },
        },
      },
      mode: { type: "keyword" },
      status: { type: "keyword" },
      succeeded: { type: "integer" },
      failed: { type: "integer" },
      errors: {
        type: "object",
        properties: {
          subjectId: { type: "keyword" },
          message: { type: "text" },
          stack: { type: "text" },
        },
      },
      warnings: {
        type: "object",
        properties: {
          subjectId: { type: "keyword" },
          datasetTitle: { type: "text" },
          type: { type: "keyword" },
          details: { type: "keyword" },
        },
      },
      succeededDatasets: {
        type: "object",
        properties: {
          subjectId: { type: "keyword" },
          datasetTitle: { type: "text" },
        },
      },
    },
  },
});

export const buildRunLogDocumentBody = (log: HarvesterRunLog) => log;

export const buildListRunsBody = (
  start: number,
  rows: number,
  status?: HarvesterRunStatus
) => ({
  from: start,
  size: rows,
  sort: [{ startedAt: { order: "desc" } }],
  query: status ? { term: { status } } : { match_all: {} },
  _source: { excludes: ["succeededDatasets"] },
});
