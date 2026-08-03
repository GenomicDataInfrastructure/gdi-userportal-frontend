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

export function formatEntitlementEntityLabel(
  source?: string,
  by?: string
): string | undefined {
  if (!source && !by) return undefined;
  const parts = [
    by ? `Granted by: ${by}` : null,
    source ? `Source: ${source}` : null,
  ].filter(Boolean);
  return parts.join(" | ");
}
