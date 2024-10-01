// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import { useDatasets } from "@/providers/datasets/DatasetsProvider";
import { useSearchParams } from "next/navigation";

export default function NoDatasetMessage() {
  const { datasetCount, isLoading } = useDatasets();
  const searchParams = useSearchParams();

  const hasAppliedFilters = React.useMemo(() => {
    if (!searchParams) return false;
    return Array.from(searchParams.entries()).some(
      ([key]) => key !== "page" && key.includes("-")
    );
  }, [searchParams]);

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
