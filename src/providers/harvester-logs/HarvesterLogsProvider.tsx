// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getHarvesterRunApi,
  listHarvesterRunsApi,
} from "@/app/api/discovery/harvester-logs";
import {
  HarvesterRunLog,
  HarvesterRunStatus,
  HarvesterRunSummary,
} from "@/app/api/discovery/local-store/harvester-logs/types";

export const HARVESTER_RUNS_PER_PAGE = 20;

type HarvesterLogsState = {
  runs?: HarvesterRunSummary[];
  runCount?: number;
  isLoading: boolean;
  errorCode?: number;
  selectedRun?: HarvesterRunLog | null;
  isLoadingSelectedRun: boolean;
  selectRun: (runId: string) => Promise<void>;
  clearSelectedRun: () => void;
};

const HarvesterLogsContext = createContext<HarvesterLogsState | undefined>(
  undefined
);

type HarvesterLogsProviderProps = {
  children: React.ReactNode;
  currentPage: number;
  status?: HarvesterRunStatus;
};

export default function HarvesterLogsProvider({
  children,
  currentPage,
  status,
}: HarvesterLogsProviderProps) {
  const [runs, setRuns] = useState<HarvesterRunSummary[]>();
  const [runCount, setRunCount] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<number>();

  const [selectedRun, setSelectedRun] = useState<HarvesterRunLog | null>();
  const [isLoadingSelectedRun, setIsLoadingSelectedRun] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchRuns() {
      setIsLoading(true);
      setErrorCode(undefined);
      try {
        const start = (currentPage - 1) * HARVESTER_RUNS_PER_PAGE;
        const data = await listHarvesterRunsApi(
          start,
          HARVESTER_RUNS_PER_PAGE,
          status
        );
        if (!cancelled) {
          setRuns(data.results);
          setRunCount(data.count);
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorCode(500);
          setIsLoading(false);
        }
        console.error(error);
      }
    }

    fetchRuns();
    return () => {
      cancelled = true;
    };
  }, [currentPage, status]);

  const selectRunRequestId = useRef(0);

  const selectRun = useCallback(async (runId: string) => {
    const requestId = ++selectRunRequestId.current;
    setIsLoadingSelectedRun(true);
    try {
      const run = await getHarvesterRunApi(runId);
      if (requestId === selectRunRequestId.current) {
        setSelectedRun(run);
        setIsLoadingSelectedRun(false);
      }
    } catch (error) {
      if (requestId === selectRunRequestId.current) {
        setSelectedRun(null);
        setIsLoadingSelectedRun(false);
      }
      console.error(error);
    }
  }, []);

  const clearSelectedRun = useCallback(() => setSelectedRun(undefined), []);

  const value = useMemo(
    () => ({
      runs,
      runCount,
      isLoading,
      errorCode,
      selectedRun,
      isLoadingSelectedRun,
      selectRun,
      clearSelectedRun,
    }),
    [
      runs,
      runCount,
      isLoading,
      errorCode,
      selectedRun,
      isLoadingSelectedRun,
      selectRun,
      clearSelectedRun,
    ]
  );

  return (
    <HarvesterLogsContext.Provider value={value}>
      {children}
    </HarvesterLogsContext.Provider>
  );
}

export function useHarvesterLogs() {
  const context = useContext(HarvesterLogsContext);
  if (context === undefined) {
    throw new Error(
      "useHarvesterLogs must be used within a HarvesterLogsProvider"
    );
  }
  return context;
}
