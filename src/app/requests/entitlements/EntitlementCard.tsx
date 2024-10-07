// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import DatasetCard from "@/app/datasets/DatasetCard";
import { CardItem } from "@/components/Card";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";

type EntitlementCardProps = {
  dataset: SearchedDataset;
  cardItems: CardItem[];
  start?: string;
  end?: string;
};

function EntitlementCard({
  dataset,
  cardItems,
}: Readonly<EntitlementCardProps>) {
  return <DatasetCard dataset={dataset} cardItems={cardItems} />;
}

export default EntitlementCard;
