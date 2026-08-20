// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/config";
import { isHarvesterLoggingEnabled } from "@/app/api/discovery/local-store/harvester-logs/factory";
import { HarvesterRunStatus } from "@/app/api/discovery/local-store/harvester-logs/types";
import HarvesterLogsPageClient from "./HarvesterLogsPageClient";

const VALID_STATUSES: HarvesterRunStatus[] = ["success", "partial", "failed"];

type HarvesterLogsPageProps = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

export default async function HarvesterLogsPage({
  searchParams,
}: Readonly<HarvesterLogsPageProps>) {
  if (!isHarvesterLoggingEnabled()) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const _searchParams = await searchParams;
  if (!_searchParams.page) {
    redirect("/harvester-logs?page=1");
  }

  const currentPage = Number(_searchParams.page);
  const status = VALID_STATUSES.includes(
    _searchParams.status as HarvesterRunStatus
  )
    ? (_searchParams.status as HarvesterRunStatus)
    : undefined;

  return <HarvesterLogsPageClient currentPage={currentPage} status={status} />;
}
