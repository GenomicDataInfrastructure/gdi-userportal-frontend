// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

/**
 * Shown when the LS-AAI passport could not be fetched (e.g. token expired,
 * LS-AAI service unavailable). Prompts the user to re-authenticate.
 */
export default function PassportUnavailableBanner() {
  const t = useTranslations("requests.entitlements");

  return (
    <div
      className="mb-6 flex items-start gap-3 rounded-lg border-l-4 border-l-warning bg-warning/10 p-4 shadow-lg"
      role="alert"
    >
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className="mt-0.5 h-5 w-5 shrink-0 text-warning"
      />
      <p className="text-sm text-gray-800">{t("passportUnavailable")}</p>
    </div>
  );
}
