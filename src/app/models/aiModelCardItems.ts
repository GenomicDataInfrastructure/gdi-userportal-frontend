// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CardItem } from "@/components/Card";
import {
  createDateCardItems,
  createPublisherCardItem,
  DateCardItemLabels,
} from "@/components/cardItems";
import { DiscoverySearchedAiModel } from "@/app/api/discovery/providers/types";

export function createAiModelCardItems(
  aiModel: DiscoverySearchedAiModel,
  dateLabels: DateCardItemLabels
): CardItem[] {
  return [
    ...createDateCardItems(aiModel, dateLabels),
    createPublisherCardItem(aiModel),
  ];
}
