// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CardItem } from "@/components/Card";
import { formatDate } from "@/utils/formatDate";
import {
  faBookBookmark,
  faCalendarAlt,
  faFile,
  faSyncAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

export function createDatasetCardItems(dataset: SearchedDataset): CardItem[] {
  return [
    {
      text:
        (dataset.createdAt && `Created on ${formatDate(dataset.createdAt)}`) ||
        "",
      icon: faCalendarAlt,
    },
    {
      text:
        (dataset.modifiedAt &&
          `Modified on ${formatDate(dataset.modifiedAt)}`) ||
        "",
      icon: faSyncAlt,
    },
    {
      text:
        (dataset.publishers!.length > 0 &&
          `Published by ${dataset.publishers!.map((p) => p.name).join(", ")}`) ||
        "",
      icon: faUser,
    },
    {
      text:
        (dataset.distributionsCount &&
          (dataset.distributionsCount === 1
            ? "1 Distribution"
            : `${dataset.distributionsCount} Distributions`)) ||
        "",
      icon: faFile,
    },
    {
      text:
        (dataset.recordsCount &&
          (dataset.recordsCount === 1
            ? "1 Record"
            : `${dataset.recordsCount} Records`)) ||
        "",
      icon: faBookBookmark,
    },
  ];
}
