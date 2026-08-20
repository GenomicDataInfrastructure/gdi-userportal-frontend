// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { HarvesterRunStatus } from "@/app/api/discovery/local-store/harvester-logs/types";

const statusStyles: Record<HarvesterRunStatus, string> = {
  success: "bg-green-100 text-green-800",
  partial: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

type HarvesterRunStatusBadgeProps = {
  status: HarvesterRunStatus;
};

export default function HarvesterRunStatusBadge({
  status,
}: Readonly<HarvesterRunStatusBadgeProps>) {
  const t = useTranslations();

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
    >
      {t(`harvesterLogs.status.${status}`)}
    </span>
  );
}
