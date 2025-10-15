// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CardItem } from "@/components/Card";
import { formatDate } from "@/utils/formatDate";
import { getLabelName } from "@/utils/getLabelName";
import {
  faCalendarAlt,
  faDatabase,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ListedApplication } from "@/app/api/access-management/open-api/schemas";

export function createApplicationCardItems(
  application: ListedApplication
): CardItem[] {
  return [
    {
      text:
        (application.createdAt &&
          `Created on ${formatDate(application.createdAt)}`) ||
        "",
      icon: faCalendarAlt,
    },
    {
      text:
        (application.stateChangedAt &&
          `Modified on ${formatDate(application.stateChangedAt)}`) ||
        "",
      icon: faSyncAlt,
    },
    ...application.datasets!.map((dataset) => ({
      text: getLabelName(dataset.title!),
      icon: faDatabase,
    })),
  ];
}
