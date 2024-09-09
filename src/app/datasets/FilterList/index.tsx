// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  FilterItemProps,
  convertDataToFilterItemProps,
} from "@/utils/convertDataToFilterItemProps";
import Button from "@/components/Button";
import FilterItem from "./FilterItem";
import { Facet } from "@/services/discovery/types/facets.type";

export default async function FilterList({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const searchFacets = (await (
    await fetch("http://localhost:3000/api/facets")
  ).json()) as Facet[];

  const facetGroups = new Set(searchFacets.map((facet) => facet.facetGroup));

  const filterItemProps: FilterItemProps[] =
    convertDataToFilterItemProps(searchFacets);

  function isAnyGroupFilterApplied() {
    if (!searchParams) return false;
    return Array.from(Object.keys(searchParams)).some(
      (key) => key !== "page" && key !== "q" && facetGroups.has(key)
    );
  }

  function getQueryStringWithoutGroupFilter() {
    const params = Array.from(Object.keys(searchParams));

    if (!params.length) return "";

    const filteredParamsQuery = params
      .filter((x) => facetGroups.has(x) && x !== "page")
      .map((x) => `&${x}=${searchParams?.x})}`)
      .join("");

    return filteredParamsQuery;
  }

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
      {isAnyGroupFilterApplied() && (
        <div className="mt-4 flex justify-end">
          <Button
            href={`/datasets?page=1${getQueryStringWithoutGroupFilter()}`}
            text="Clear Filters"
            type="warning"
          />
        </div>
      )}
    </div>
  );
}
