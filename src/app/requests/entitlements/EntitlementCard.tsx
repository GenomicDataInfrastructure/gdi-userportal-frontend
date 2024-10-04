// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import DatasetCard from "@/components/DatasetCard";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import { formatDate } from "@/utils/formatDate";

type EntitlementCardProps = {
  dataset: SearchedDataset;
  start?: string;
  end?: string;
};

function EntitlementCard({
  dataset,
  start,
  end,
}: Readonly<EntitlementCardProps>) {
  return (
    <DatasetCard dataset={dataset} showAddToBasketButton={false}>
      <div className="absolute top-2 right-0 mr-4">
        <p className="text-xs sm:text-base">
          <span className="text-info font-bold">Start: </span>
          {!start ? "-" : formatDate(start!)}
        </p>
      </div>
      <div className="absolute bottom-2 right-0 mr-4">
        <p className="text-xs sm:text-base">
          <span className="text-info font-bold">End: </span>
          {!end ? "-" : formatDate(end!)}
        </p>
      </div>
    </DatasetCard>
  );
}

export default EntitlementCard;
