// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { createDatasetCardItems } from "@/app/datasets/datasetCardItems";
import { CardItem } from "@/components/Card";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import { formatDate } from "@/utils/formatDate";
import {
  faCalendarCheck,
  faCalendarXmark,
} from "@fortawesome/free-solid-svg-icons";

export function createEntitlementCardItems(
  dataset: SearchedDataset,
  start: string,
  end: string
): CardItem[] {
  return [
    ...createDatasetCardItems(dataset),
    {
      text: `Start: ${formatDate(start!)}`,
      icon: faCalendarCheck,
    },
    {
      text: `End: ${formatDate(end!)}`,
      icon: faCalendarXmark,
    },
  ];
}
