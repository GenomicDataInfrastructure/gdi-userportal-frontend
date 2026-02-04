// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import React from "react";
import AddToBasketButton from "@/components/AddToBasketButton";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";
import { findDatasetByIdentifier } from "@/utils/datasetEntitlements";

type VariantAddToBasketButtonProps = {
  datasetId: string;
};

export default function VariantAddToBasketButton({
  datasetId,
}: VariantAddToBasketButtonProps) {
  const [dataset, setDataset] = React.useState<SearchedDataset | null>(null);

  React.useEffect(() => {
    if (!datasetId) return;
    findDatasetByIdentifier(datasetId)
      .then((data) => setDataset(data ?? null))
      .catch(console.error);
  }, [datasetId]);

  return <AddToBasketButton dataset={dataset} disabled={!datasetId} />;
}
