// SPDX-FileCopyrightText: 2024 PNED G.I.E.
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
  const publisherNames = dataset.publishers
    ?.map((publisher) => publisher.name)
    .filter((name): name is string => Boolean(name));

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
        ((publisherNames?.length ?? 0) > 0 &&
          `Published by ${(publisherNames ?? []).join(", ")}`) ||
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
