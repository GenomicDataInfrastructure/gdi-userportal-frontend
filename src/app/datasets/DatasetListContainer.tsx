// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Error from "@/app/error";
import PaginationContainer from "@/components/PaginationContainer";
import DatasetList from "../../components/DatasetList";
import {
  DATASET_PER_PAGE,
  useDatasets,
} from "@/providers/datasets/DatasetsProvider";
import { useSearchParams } from "next/navigation";

export default function DatasetListContainer() {
  const queryParams = useSearchParams();
  const { datasets, datasetCount, isLoading, errorCode } = useDatasets();

  if (isLoading) {
    return (
      <div className="col-start-0 col-span-12 xl:col-span-8 xl:col-start-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full mb-4 animate-pulse">
            <div className="h-36 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        ))}
      </div>
    );
  } else if (errorCode) {
    return (
      <div className="col-start-0 col-span-12 xl:col-span-8 xl:col-start-5">
        <Error statusCode={errorCode} />
      </div>
    );
  }

  return (
    <>
      <div className="col-start-0 col-span-12 xl:col-span-8 xl:col-start-5">
        <DatasetList datasets={datasets || []} />
      </div>
      <div className="col-start-0 col-span-12 my-10 xl:col-span-8 xl:col-start-5">
        <PaginationContainer
          datasetCount={datasetCount || 0}
          datasetPerPage={DATASET_PER_PAGE}
          pathname="/datasets"
          queryParams={queryParams || new URLSearchParams()}
        />
      </div>
    </>
  );
}
