// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import NoResultsMessage from "@/components/NoResultsMessage";
import { useDatasets } from "@/providers/datasets/DatasetsProvider";
import { useFilters } from "@/providers/filters/FilterProvider";

export default function NoDatasetMessage() {
  const { datasetCount, isLoading } = useDatasets();
  const { activeFilters } = useFilters();

  return (
    <NoResultsMessage
      namespace="datasets"
      count={datasetCount}
      isLoading={isLoading}
      hasAppliedFilters={activeFilters.length > 0}
    />
  );
}
