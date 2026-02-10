// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import FilterItem from "./FilterItem";
import { useFilters } from "@/providers/filters/FilterProvider";

export default function FilterList() {
  const { data: session } = useSession();
  const { filters } = useFilters();
  const searchParams = useSearchParams();

  // Check if Beacon is enabled via URL parameter
  const includeBeacon = searchParams.get("beacon") === "true";

  // Check if user is logged in
  // TODO: Add role check later - only show for users with BEACON_USER role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const hasBeaconAccess = (session?.user as any)?.roles?.includes("BEACON_USER");
  const hasBeaconAccess = !!session?.user; // Show for all logged-in users for now

  // Filter what to show based on beacon toggle and user access
  const visibleFilters = filters.filter((filter) => {
    if (filter.source === "beacon") {
      // Only show Beacon filters if:
      // 1. User has Beacon access AND
      // 2. Beacon toggle is ON
      return includeBeacon && hasBeaconAccess;
    }
    // Always show CKAN filters
    return true;
  });

  // Group filters by source
  const ckanFilters = visibleFilters.filter((f) => f.source === "ckan");
  const beaconFilters = visibleFilters.filter((f) => f.source === "beacon");

  return (
    <div className="flex flex-col gap-y-8">
      {/* CKAN Filters Section */}
      {ckanFilters.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wide">
            Catalog Filters
          </h3>
          <ul className="flex flex-col gap-y-6">
            {ckanFilters.map((filter) => (
              <li key={filter.key} className="list-none">
                <FilterItem filter={filter} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Beacon Filters Section - Only when toggle is ON */}
      {beaconFilters.length > 0 && (
        <section>
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 tracking-wide">
              Beacon Network Filters
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Filter by individual-level data characteristics
            </p>
            <ul className="flex flex-col gap-y-6">
              {beaconFilters.map((filter) => (
                <li key={filter.key} className="list-none">
                  <FilterItem filter={filter} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
