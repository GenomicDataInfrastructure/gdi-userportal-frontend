// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { useEffect, useState } from "react";
import { portalStatistics } from "@/services/ckan/index.server";
import { PortalStatistics as IPortalStatistics } from "@/services/ckan/types/portalStatistics.types";

export function PortalStatistics() {
  const [propCounters, setPropCounters] = useState<IPortalStatistics | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await portalStatistics();
      setPropCounters(data);
    };

    fetchData();
  }, []);

  if (propCounters === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-20 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {Object.entries(propCounters).map(([key, value]) => (
            <div
              key={key}
              className="transform transition duration-500 ease-in-out hover:scale-105"
            >
              <div className="cursor-pointer rounded-lg bg-white p-4 text-center shadow-md hover:shadow-xl">
                <div className="text-xl font-semibold hover:text-info md:text-2xl">
                  {value.toLocaleString("en-GB")}
                </div>
                <div className="md:text-md mt-2 text-sm hover:text-info">
                  {key}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
