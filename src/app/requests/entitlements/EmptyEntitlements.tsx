// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@/components/Button";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

type EmptyEntitlementsProps = {
  /**
   * When `true`, the passport was retrieved from LS-AAI successfully but
   * contained no valid ControlledAccessGrants visas.  A different message is
   * shown instead of the default "no entitlement yet" copy.
   */
  noValidGrants?: boolean;
};

export function EmptyEntitlements({
  noValidGrants = false,
}: EmptyEntitlementsProps) {
  const t = useTranslations();

  if (noValidGrants) {
    return (
      <div className="mb-7 flex w-full flex-col items-center justify-center gap-4">
        <p className="text-md text-center text-primary">
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
