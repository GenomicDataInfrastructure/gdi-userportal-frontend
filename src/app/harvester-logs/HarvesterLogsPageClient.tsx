// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import PageContainer from "@/components/PageContainer";
import HarvesterLogsProvider from "@/providers/harvester-logs/HarvesterLogsProvider";
import { HarvesterRunStatus } from "@/app/api/discovery/local-store/harvester-logs/types";
import HarvesterRunListContainer from "./HarvesterRunListContainer";

type HarvesterLogsPageClientProps = {
  currentPage: number;
  status?: HarvesterRunStatus;
};

export default function HarvesterLogsPageClient({
  currentPage,
  status,
}: Readonly<HarvesterLogsPageClientProps>) {
  const t = useTranslations();

  return (
    <PageContainer
      searchParams={{
        page: String(currentPage),
        ...(status ? { status } : {}),
      }}
      className="pt-5"
    >
      <h1 className="text-2xl font-semibold mb-1">
        {t("harvesterLogs.title")}
      </h1>
      <p className="text-gray-600 mb-6">{t("harvesterLogs.subtitle")}</p>
      <HarvesterLogsProvider currentPage={currentPage} status={status}>
        <HarvesterRunListContainer currentPage={currentPage} status={status} />
      </HarvesterLogsProvider>
    </PageContainer>
  );
}
