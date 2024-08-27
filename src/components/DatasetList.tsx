// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import DatasetCard from "@/components/DatasetCard";

type DatasetListProps = {
  datasets: SearchedDataset[];
};

function DatasetList({ datasets }: Readonly<DatasetListProps>) {
  return (
    <List>
      {datasets.map((dataset: SearchedDataset) => (
        <ListItem
          key={dataset.id}
          className="bg-white mb-4 flex items-center justify-center px-2 rounded-lg  shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50"
        >
          <DatasetCard dataset={dataset} />
        </ListItem>
      ))}
    </List>
  );
}

export default DatasetList;
