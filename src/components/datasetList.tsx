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
    <ul className="flex flex-col gap-y-12">
      {datasets.map((dataset: Dataset) => (
        <li key={dataset.id}>
          <DatasetItem
            id={dataset.id}
            title={dataset.title}
            publicationDate={dataset.metadataCreated}
            catalogue={dataset.organization.title}
            description={dataset.notes}
            themes={dataset.theme || []}
          />
        </li>
      ))}
    </ul>
  );
}

export default DatasetList;
