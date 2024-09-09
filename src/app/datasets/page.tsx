// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Error from "@/app/error";
import PaginationContainer from "@/components/PaginationContainer";
import { redirect, useSearchParams } from "next/navigation";
import DatasetList from "../../components/DatasetList";
import { useDatasets } from "@/providers/datasets/DatasetsProvider";

const DATASET_PER_PAGE = 12;

export default function DatasetPage() {
  const queryParams = useSearchParams();
  const { datasets, datasetCount, isLoading, errorCode } = useDatasets();

  if (!queryParams.get("page")) {
    redirect("/datasets?page=1");
  }

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
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
      <div className="col-start-0 col-span-12 xl:col-span-8 xl:col-start-5">
        <DatasetList datasets={datasets!} />
      </div>
      <div className="col-start-0 col-span-12 my-10 xl:col-span-8 xl:col-start-5">
        <PaginationContainer
          datasetCount={datasetCount!}
          datasetPerPage={DATASET_PER_PAGE}
          pathname="/datasets"
          queryParams={queryParams}
        />
      </div>
    </>
  );
}
