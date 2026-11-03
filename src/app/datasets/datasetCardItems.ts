// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CardItem } from "@/components/Card";
import {
  createDateCardItems,
  createPublisherCardItem,
} from "@/components/cardItems";
import { formatDate } from "@/utils/formatDate";
import {
  faBookBookmark,
  faClock,
  faFile,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

export function createDatasetCardItems(dataset: SearchedDataset): CardItem[] {
  const hasTemporalCoverageSummary = Boolean(
    dataset.temporalCoverageStart || dataset.temporalCoverageEnd
  );

  return [
    ...createDateCardItems(dataset),
    {
      text:
        (hasTemporalCoverageSummary &&
          `${dataset.temporalCoverageStart ? formatDate(dataset.temporalCoverageStart) : "N/A"} — ${dataset.temporalCoverageEnd ? formatDate(dataset.temporalCoverageEnd) : "Present"}`) ||
        "",
      icon: faClock,
    },
    createPublisherCardItem(dataset),
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
        (dataset.inSeriesCount &&
          (dataset.inSeriesCount === 1
            ? "1 Dataset series"
            : `${dataset.inSeriesCount} Dataset series`)) ||
        "",
      icon: faLayerGroup,
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
