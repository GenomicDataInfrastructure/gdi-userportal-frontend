// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import FilterItem from "./FilterItem";
import { useFilters } from "@/providers/filters/FilterProvider";

export default function FilterList() {
  const { filters } = useFilters();
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
