// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CardItem } from "@/components/Card";
import {
  createDateCardItems,
  createPublisherCardItem,
} from "@/components/cardItems";
import { DiscoverySearchedAiModel } from "@/app/api/discovery/providers/types";

export function createAiModelCardItems(
  aiModel: DiscoverySearchedAiModel
): CardItem[] {
  return [...createDateCardItems(aiModel), createPublisherCardItem(aiModel)];
}
