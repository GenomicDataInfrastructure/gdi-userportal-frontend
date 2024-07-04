// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import { portalStatistics } from "@/services/discovery/index.public";
import { PortalStatistics as IPortalStatistics } from "@/services/discovery/types/portalStatistics.types";
import { useEffect, useState } from "react";
import { useAlert } from "@/providers/AlertProvider";
import { AxiosError } from "axios";

export function PortalStatistics() {
  const { setAlert } = useAlert();
  const [propCounters, setPropCounters] = useState<IPortalStatistics | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portalStatistics();
        setPropCounters(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setAlert({
            type: "error",
            message:
              error.response?.data?.title ||
              `Failed to fetch portal statistics, status code: ${error.response?.status}`,
            details: error.response?.data?.detail,
          });
        }
      }
    };

    fetchData();
  }, [setAlert]);

  if (propCounters === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {Object.entries(propCounters).map(([key, value]) => (
            <div key={key}>
              <div className="rounded-lg bg-white p-4 text-center shadow-md">
                <div className="text-xl font-semibold md:text-2xl">
                  {value.toLocaleString("en-GB")}
                </div>
                <div className="md:text-md mt-2 text-sm">{key}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
