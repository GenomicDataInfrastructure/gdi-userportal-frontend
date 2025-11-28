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
        className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
          includeBeacon
            ? "bg-blue-50 border-blue-300"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <input
          type="checkbox"
          id="beacon-toggle"
          checked={includeBeacon}
          onChange={(e) => handleToggle(e.target.checked)}
          disabled={isLoading}
          className="mt-1 w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
        />
        <label
          htmlFor="beacon-toggle"
          className="flex-1 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 font-semibold text-base mb-1">
            <span>🔬</span>
            <span>Include Beacon Network</span>
            {includeBeacon && (
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {includeBeacon ? (
              <>
                Showing datasets with available individual-level data and record
                counts from Beacon Network.{" "}
                <span className="text-blue-600">(Searches may be slower)</span>
              </>
            ) : (
              <>
                Get individual-level data filters and record counts by enabling
                Beacon Network.
              </>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
