// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useDatasets } from "@/providers/datasets/DatasetsProvider";

export default function DatasetCount() {
  const { datasetCount, isLoading, errorCode } = useDatasets();
  let text;
  if (isLoading || datasetCount === undefined) {
    text = "";
  } else if (errorCode) {
    text = "No dataset found";
  } else {
    text = `${datasetCount} ${datasetCount > 1 ? "datasets" : "dataset"} found`;
  }
  return (
    <p className="col-start-0 col-span-12 mt-5 xl:mb-12 mb-4 text-center text-sm text-info h-9">
      {text}
    </p>
  );
}
