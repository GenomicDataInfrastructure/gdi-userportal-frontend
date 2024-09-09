"use client";

import { useDatasets } from "@/providers/datasets/DatasetsProvider";

export default function DatasetCount() {
  const { datasetCount, isLoading, errorCode } = useDatasets();
  return (
    <p className="col-start-0 col-span-12 mt-5 mb-12 text-center text-sm text-info">
      {isLoading && ""}
      {errorCode && "No dataset found"}
      {datasetCount !== undefined &&
        `${datasetCount!} ${datasetCount! > 1 ? "datasets" : "dataset"} found`}
    </p>
  );
}
