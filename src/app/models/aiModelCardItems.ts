// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faBook } from "@fortawesome/free-solid-svg-icons";
import { CardItem } from "@/components/Card";
import {
  createDateCardItems,
  createPublisherCardItem,
  DateCardItemLabels,
} from "@/components/cardItems";
import { DiscoverySearchedAiModel } from "@/app/api/discovery/providers/types";

export function createAiModelCardItems(
  aiModel: DiscoverySearchedAiModel,
  dateLabels: DateCardItemLabels,
  librariesLabel: string
): CardItem[] {
  return [
    ...createDateCardItems(aiModel, dateLabels),
    createPublisherCardItem(aiModel),
    createLibrariesCardItem(aiModel, librariesLabel),
  ];
}

function createLibrariesCardItem(
  aiModel: DiscoverySearchedAiModel,
  label: string
): CardItem {
  return {
    text:
      ((aiModel.libraries?.length ?? 0) > 0 &&
        `${label}: ${(aiModel.libraries ?? []).join(", ")}`) ||
      "",
    icon: faBook,
  };
}
