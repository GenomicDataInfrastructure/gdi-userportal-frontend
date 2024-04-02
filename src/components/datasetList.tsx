// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Dataset } from "@/types/dataset.types";
import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import DatasetItem from "./datasetItem";

type DatasetListProps = {
  datasets: Dataset[];
};

function DatasetList({ datasets }: DatasetListProps) {
  return (
    <List>
      {datasets.map((dataset: Dataset) => (
        <ListItem key={dataset.id}>
          <DatasetItem dataset={dataset} />
        </ListItem>
      ))}
    </List>
  );
}

export default DatasetList;
