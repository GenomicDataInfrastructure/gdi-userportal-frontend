// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Dataset } from "@/types/dataset.types";
import DatasetItem from "./datasetItem";

type DatasetListProps = {
  datasets: Dataset[];
};

function DatasetList({ datasets }: DatasetListProps) {
  return (
    <ul className="flex w-full flex-col gap-y-4">
      {datasets.map((dataset: Dataset) => (
        <li key={dataset.id}>
          <DatasetItem dataset={dataset} />
        </li>
      ))}
    </ul>
  );
}

export default DatasetList;
