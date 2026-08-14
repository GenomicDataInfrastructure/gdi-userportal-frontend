// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faDatabase, faLink, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

type FallbackEntitlementCardProps = {
  datasetId: string;
  by?: string;
  source?: string;
};

/**
 * Minimal entitlement card shown when full dataset details cannot be resolved.
 * Displays the raw visa fields (dataset ID, granted-by, source).
 * A single consolidated notice is shown above the list — not repeated here.
 */
export default function FallbackEntitlementCard({
  datasetId,
  by,
  source,
}: Readonly<FallbackEntitlementCardProps>) {
  const t = useTranslations("requests.entitlements");

  return (
    <div className="w-full p-4">
      <p className="mb-2 text-xs italic text-red-500">
        {t("datasetUnavailable")}
      </p>
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
