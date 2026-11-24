// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faBook, faKey } from "@fortawesome/free-solid-svg-icons";
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
  librariesLabel: string,
  licencesLabel: string
): CardItem[] {
  return [
    ...createDateCardItems(aiModel, dateLabels),
    createPublisherCardItem(aiModel),
    createValueListCardItem(aiModel.libraries, librariesLabel, faBook),
    createValueListCardItem(aiModel.licences, licencesLabel, faKey),
  ];
}

function createValueListCardItem(
  values: string[] | undefined,
  label: string,
  icon: CardItem["icon"]
): CardItem {
  return {
    text: (values?.length ?? 0) > 0 ? `${label}: ${values!.join(", ")}` : "",
    icon,
  };
}
