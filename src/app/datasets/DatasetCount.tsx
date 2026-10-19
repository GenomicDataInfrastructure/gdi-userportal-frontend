// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import ResultCount from "@/components/ResultCount";
import { useDatasets } from "@/providers/datasets/DatasetsProvider";

export default function DatasetCount() {
  const { datasetCount, isLoading, errorCode } = useDatasets();
  return (
    <ResultCount
      namespace="datasets"
      count={datasetCount}
      isLoading={isLoading}
      errorCode={errorCode}
    />
  );
}
