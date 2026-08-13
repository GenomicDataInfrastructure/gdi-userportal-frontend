// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  faDatabase,
  faExclamationTriangle,
  faLink,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

type FallbackEntitlementCardProps = {
  datasetId: string;
  by?: string;
  source?: string;
};

/**
 * Renders minimal entitlement information when full dataset details cannot be
 * resolved from the catalogue.  Displays the raw visa fields (dataset ID,
 * granted-by, source) together with a user-facing fallback message.
 */
export default function FallbackEntitlementCard({
  datasetId,
  by,
  source,
}: Readonly<FallbackEntitlementCardProps>) {
  const t = useTranslations("requests.entitlements");

  return (
    <div className="w-full p-4">
      {/* Warning banner */}
      <div className="mb-3 flex items-start gap-2 rounded-lg border-l-4 border-l-warning bg-warning/10 p-3 shadow-lg">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="mt-0.5 h-4 w-4 shrink-0 text-warning"
        />
        <p className="text-sm text-gray-800">{t("datasetUnavailable")}</p>
      </div>

      {/* Minimal grant info from the visa */}
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faDatabase} className="w-4 text-info" />
          <span className="font-medium">{datasetId}</span>
        </div>
        {by && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="w-4 text-gray-500" />
            <span>
              {t("grantedBy")}: {by}
            </span>
          </div>
        )}
        {source && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLink} className="w-4 text-gray-500" />
            <span>
              {t("source")}: {source}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
