// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { createDatasetCardItems } from "@/app/datasets/datasetCardItems";
import { CardItem } from "@/components/Card";
import { formatDate } from "@/utils/formatDate";
import {
  faCalendarCheck,
  faCalendarXmark,
} from "@fortawesome/free-solid-svg-icons";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

export function createEntitlementCardItems(
  dataset: SearchedDataset,
  start?: string,
  end?: string
): CardItem[] {
  return [
    ...createDatasetCardItems(dataset),
    {
      text: `Start: ${formatDate(start)}`,
      icon: faCalendarCheck,
    },
    {
      text: `End: ${formatDate(end)}`,
      icon: faCalendarXmark,
    },
  ];
}

export type EntitlementLabelMessages = {
  grantedBy: string;
  source: string;
};

export function formatEntitlementSourceLabel(
  source?: string,
  by?: string,
  messages?: EntitlementLabelMessages
): string | undefined {
  if (!source && !by) return undefined;
  const grantedByLabel = messages?.grantedBy ?? "Granted by";
  const sourceLabel = messages?.source ?? "Source";
  const parts = [
    by ? `${grantedByLabel}: ${by}` : null,
    source ? `${sourceLabel}: ${source}` : null,
  ].filter(Boolean) as string[];
  return parts.join(" | ");
}
