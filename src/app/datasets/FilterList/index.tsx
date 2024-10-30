// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Filter } from "@/services/discovery/types/filter.type";
import FilterItem from "./FilterItem";

type FilterListProps = {
  filters: Filter[];
};

export default async function FilterList({ filters }: FilterListProps) {
  const filtersSortedBySource = filters.sort((f1, f2) =>
    f2.source.localeCompare(f1.source)
  );

  return (
    <ul className="flex flex-col gap-y-6">
      {filtersSortedBySource.map((filter) => (
        <li key={filter.key} className="list-none">
          <FilterItem filter={filter} />
        </li>
      ))}
    </ul>
  );
}
