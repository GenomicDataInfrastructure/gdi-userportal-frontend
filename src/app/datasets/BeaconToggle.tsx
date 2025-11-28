// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function BeaconToggle() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in
  // TODO: Add role check later - only show for users with BEACON_USER role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const userRoles = (session?.user as any)?.roles;
  // const hasBeaconAccess = userRoles?.includes("BEACON_USER");
  const hasBeaconAccess = !!session?.user; // Show for all logged-in users for now

  // Get current state from URL parameter
  const includeBeacon = searchParams.get("beacon") === "true";

  // Don't show toggle if user is not logged in
  if (!hasBeaconAccess) {
    return null;
  }

  const handleToggle = (checked: boolean) => {
    setIsLoading(true);

    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.set("beacon", "true");
    } else {
      params.delete("beacon");
    }

    // Reset to page 1 when toggling
    params.set("page", "1");

    // Navigate to updated URL (will trigger re-search)
    router.push(`/datasets?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <div
        className={`shadow-lg rounded-lg border-b-4 transition ${
          includeBeacon
            ? "border-b-secondary bg-gray-50"
            : "border-b-[#B5BFC4] hover:border-b-secondary hover:bg-gray-50"
        }`}
      >
        <label
          htmlFor="beacon-toggle"
          className="flex items-start gap-4 p-4 cursor-pointer"
        >
          <input
            type="checkbox"
            id="beacon-toggle"
            checked={includeBeacon}
            onChange={(e) => handleToggle(e.target.checked)}
            disabled={isLoading}
            className="mt-1 h-4 w-4 border rounded-md checked:accent-warning flex-none cursor-pointer disabled:opacity-50"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 font-semibold text-base mb-1">
              <span>🔬</span>
              <span>Include Beacon Network</span>
              {includeBeacon && (
                <span className="text-xs bg-warning text-black px-2 py-0.5 rounded-full font-normal">
                  Active
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 font-normal">
              {includeBeacon ? (
                <>
                  Showing datasets with individual-level data and record counts
                  from Beacon Network{" "}
                  <span className="text-secondary font-medium">
                    (searches may be slower)
                  </span>
                </>
              ) : (
                <>
                  Enable to filter by individual-level data characteristics and
                  see record counts
                </>
              )}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
