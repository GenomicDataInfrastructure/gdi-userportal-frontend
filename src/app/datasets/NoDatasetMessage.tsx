// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import { useDatasets } from "@/providers/datasets/DatasetsProvider";
import { useFilters } from "@/providers/filters/FilterProvider";

export default function NoDatasetMessage() {
  const { datasetCount, isLoading } = useDatasets();
  const { activeFilters } = useFilters();

  const hasAppliedFilters = activeFilters.length > 0;

  if (isLoading || datasetCount !== 0 || !hasAppliedFilters) {
    return null;
  }

  return (
    <div className="text-center py-8 mt-4">
      <p className="text-lg text-primary mb-4">
        No datasets found matching your criteria. Try adjusting your search or
        filters.
      </p>
    </div>
  );
}
