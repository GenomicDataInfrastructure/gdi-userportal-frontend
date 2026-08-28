// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@/components/Button";
import { faCircleInfo, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

type EmptyEntitlementsProps = {
  /**
   * Shows the "no valid grants" message instead of the default empty-state copy.
   * Set when the passport was fetched but contained no ControlledAccessGrants visas.
   */
  noValidGrants?: boolean;
};

export function EmptyEntitlements({
  noValidGrants = false,
}: EmptyEntitlementsProps) {
  const t = useTranslations();

  if (noValidGrants) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-lg border-l-4 border-l-info bg-info/10 p-4 shadow-lg">
        <FontAwesomeIcon
          icon={faCircleInfo}
          className="mt-0.5 h-5 w-5 shrink-0 text-info"
        />
        <p className="text-sm text-gray-800">
          {t("requests.entitlements.noValidGrants")}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-7 flex w-full flex-col items-center justify-center gap-4">
      <p className="text-md text-center text-primary">
        <span>{t("requests.entitlements.empty").split("\n")[0]}</span>
        <br />
        <span>{t("requests.entitlements.empty").split("\n")[1]}</span>
      </p>
      <Button
        icon={faPlusCircle}
        text={t("requests.applications.addDatasets")}
        href="/datasets"
        type="primary"
        className="text-xs"
      />
    </div>
  );
}
