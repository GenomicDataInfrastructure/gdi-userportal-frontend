// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { createDatasetSidebarItems } from "./sidebarItems";
import { RetrievedDataset } from "@/app/api/discovery/open-api/schemas";
import { useTranslations } from "next-intl";

type ClientSidebarProps = {
  dataset: RetrievedDataset;
};

function ClientSidebar({ dataset }: ClientSidebarProps) {
  const t = useTranslations("datasets.detail");
  const sidebarItems = createDatasetSidebarItems(dataset, {
    requestDataAccess: t("requestDataAccess"),
    externalRequestUnavailable: t("externalRequestUnavailable"),
    externalRequestPortal: t("externalRequestPortal"),
    noExternalLinkAvailable: t("noExternalLinkAvailable"),
    exportMetadataIn: t("exportMetadataIn"),
    contactPoints: t("contactPoints"),
    noContactProvided: t("noContactProvided"),
    noEmailProvided: t("noEmailProvided"),
  });

  return (
    <aside className="w-full lg:w-1/3 lg:sticky top-24">
      <div className="flex flex-col gap-4 pb-8">
        {sidebarItems.map((item, index) => (
          <div key={index} className="mb-3">
            <h3 className="text-base text-primary sm:text-lg lg:text-xl">
              {item.label}
            </h3>
            <span className="text-sm sm:text-base lg:text-lg">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ClientSidebar;
