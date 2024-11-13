// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CardItem } from "@/components/Card";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import { formatDate } from "@/utils/formatDate";
import {
  faBookBookmark,
  faCalendarAlt,
  faFile,
  faSyncAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

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
        (dataset.publishers?.length > 0 &&
          `Published by ${dataset.publishers[0].name}`) ||
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
