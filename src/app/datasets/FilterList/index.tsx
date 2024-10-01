// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  FilterItemProps,
  convertDataToFilterItemProps,
} from "@/utils/convertDataToFilterItemProps";
import FilterItem from "./FilterItem";
import { Facet } from "@/services/discovery/types/facets.type";

type FilterListProps = {
  searchFacets: Facet[];
};

export default async function FilterList({ searchFacets }: FilterListProps) {
  const filterItemProps: FilterItemProps[] = convertDataToFilterItemProps(
    searchFacets
  ).sort((f1, f2) => f2.groupKey.localeCompare(f1.groupKey));

  return (
    <div className="flex flex-col gap-y-6">
      {filterItemProps.map((props) => (
        <li key={props.field} className="list-none">
          <FilterItem
            field={props.field}
            label={props.label}
            data={props.data}
            groupKey={props.groupKey}
          />
        </li>
      ))}
    </div>
  );
}
