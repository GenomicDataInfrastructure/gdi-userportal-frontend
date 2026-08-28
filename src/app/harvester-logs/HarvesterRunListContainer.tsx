// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Error from "@/app/error";
import PaginationContainer from "@/components/PaginationContainer";
import {
  HARVESTER_RUNS_PER_PAGE,
  useHarvesterLogs,
} from "@/providers/harvester-logs/HarvesterLogsProvider";
import { HarvesterRunStatus } from "@/app/api/discovery/local-store/harvester-logs/types";
import HarvesterRunStatusBadge from "./HarvesterRunStatusBadge";
import HarvesterRunDetail from "./HarvesterRunDetail";

type HarvesterRunListContainerProps = {
  currentPage: number;
  status?: HarvesterRunStatus;
};

const STATUS_OPTIONS: HarvesterRunStatus[] = ["success", "partial", "failed"];

export default function HarvesterRunListContainer({
  currentPage,
  status,
}: Readonly<HarvesterRunListContainerProps>) {
  const t = useTranslations();
  const router = useRouter();
  const { runs, runCount, isLoading, errorCode, selectRun } =
    useHarvesterLogs();

  const handleStatusChange = (nextStatus: string) => {
    const params = new URLSearchParams({ page: "1" });
    if (nextStatus) {
      params.set("status", nextStatus);
    }
    router.push(`/harvester-logs?${params.toString()}`);
  };

  const statusFilter = (
    <div className="mb-4 flex items-center gap-2">
      <label
        htmlFor="harvester-status-filter"
        className="text-sm text-gray-600"
      >
        {t("harvesterLogs.filter.status.label")}
      </label>
      <select
        id="harvester-status-filter"
        value={status ?? ""}
        onChange={(event) => handleStatusChange(event.target.value)}
        className="border border-gray-300 rounded-md text-sm px-2 py-1"
      >
        <option value="">{t("harvesterLogs.filter.status.all")}</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t(`harvesterLogs.status.${option}`)}
          </option>
        ))}
      </select>
    </div>
  );

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  if (isLoading) {
    return (
      <div>
        {statusFilter}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full mb-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!runs?.length) {
    return (
      <>
        {statusFilter}
        <p className="text-gray-600 py-10 text-center">
          {t("harvesterLogs.empty")}
        </p>
      </>
    );
  }

  return (
    <>
      {statusFilter}
      <div className="space-y-3">
        {runs.map((run) => (
          <button
            key={run.runId}
            type="button"
            onClick={() => selectRun(run.runId)}
            className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium break-all">
                  {run.source.url ?? run.source.path}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(run.startedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-green-700">
                  {t("harvesterLogs.fields.succeeded")}: {run.succeeded}
                </span>
                <span className="text-sm text-red-700">
                  {t("harvesterLogs.fields.failed")}: {run.failed}
                </span>
                {run.warningCount > 0 && (
                  <span className="text-sm text-yellow-700">
                    {t("harvesterLogs.fields.warnings")}: {run.warningCount}
                  </span>
                )}
                <HarvesterRunStatusBadge status={run.status} />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="my-10">
        <PaginationContainer
          datasetCount={runCount || 0}
          datasetPerPage={HARVESTER_RUNS_PER_PAGE}
          currentPage={currentPage}
        />
      </div>
      <HarvesterRunDetail />
    </>
  );
}
