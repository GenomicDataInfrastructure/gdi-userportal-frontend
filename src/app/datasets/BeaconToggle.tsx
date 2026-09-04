// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  getBeaconAuthReason,
  isBeaconAuthorized,
  useBeaconAuthorization,
} from "@/providers/beacon/BeaconAuthorizationProvider";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import contentConfig from "@/config/contentConfig";

export default function BeaconToggle() {
  const t = useTranslations("datasets");
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authState = useBeaconAuthorization();

  if (!contentConfig.beaconSearchEnabled) return null;

  const isLoading =
    sessionStatus === "loading" || authState.status === "loading";
  const isAuthenticated = authState.status !== "unauthenticated";
  const authStatus = authState.status === "ready" ? authState.auth : undefined;

  // Get current state from URL parameter
  const includeBeacon = searchParams.get("beacon") === "true";

  const handleToggle = (checked: boolean) => {
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

  const canEnableBeacon = isBeaconAuthorized(authStatus);

  const { hasResearcherStatus, hasAcceptedTC } =
    getBeaconAuthReason(authStatus);

  const helperTextKey = (() => {
    if (!isAuthenticated) return "beaconLoginRequired";
    if (isLoading) return undefined;
    if (!hasResearcherStatus && !hasAcceptedTC)
      return "beaconRequirementsMissing";
    if (!hasResearcherStatus) return "beaconResearcherRequired";
    if (!hasAcceptedTC) return "beaconTermsRequired";
    return includeBeacon ? "beaconEnabled" : "beaconDisabled";
  })();

  return (
    <div className="mb-6">
      <div className="shadow-lg rounded-lg border-l-4 border-l-info bg-info/5">
        <label
          htmlFor="beacon-toggle"
          className={`flex items-start gap-4 p-4 ${
            canEnableBeacon ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          <input
            type="checkbox"
            id="beacon-toggle"
            checked={includeBeacon}
            onChange={(e) => canEnableBeacon && handleToggle(e.target.checked)}
            disabled={!canEnableBeacon}
            className="mt-1 h-4 w-4 border rounded-md checked:accent-warning flex-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 font-semibold text-base mb-1">
              <span>{t("beaconToggle")}</span>
              {includeBeacon && canEnableBeacon && (
                <span className="text-xs bg-warning text-black px-2 py-0.5 rounded-full font-normal">
                  {t("beaconActive")}
                </span>
              )}
              {isLoading && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="h-4 w-4 text-info"
                />
              )}
            </div>
            {helperTextKey && (
              <div
                className={`text-sm font-normal ${
                  canEnableBeacon ? "text-gray-600" : "text-warning"
                }`}
              >
                {t(helperTextKey)}
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
