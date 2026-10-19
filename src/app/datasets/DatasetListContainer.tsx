// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import ResultListContainer from "@/components/ResultListContainer";
import DatasetList from "./DatasetList";
import {
  DATASET_PER_PAGE,
  useDatasets,
} from "@/providers/datasets/DatasetsProvider";

type DatasetListContainerProps = {
  currentPage: number;
};

export default function DatasetListContainer({
  currentPage,
}: DatasetListContainerProps) {
  const { datasets, datasetCount, isLoading, errorCode } = useDatasets();

  return (
    <ResultListContainer
      currentPage={currentPage}
      count={datasetCount}
      perPage={DATASET_PER_PAGE}
      isLoading={isLoading}
      errorCode={errorCode}
    >
      <DatasetList datasets={datasets || []} />
    </ResultListContainer>
  );
}
