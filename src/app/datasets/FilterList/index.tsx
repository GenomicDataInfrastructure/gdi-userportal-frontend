// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import {
  FilterItemProps,
  convertDataToFilterItemProps,
} from "@/utils/convertDataToFilterItemProps";
import Button from "@/components/Button";
import FilterItem from "./FilterItem";
import { Facet } from "@/services/discovery/types/facets.type";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function FilterList() {
  const queryParams = useSearchParams();
  const [searchFacets, setSearchFacets] = useState<Facet[]>([]);

  useEffect(() => {
    async function fetchSearchFacets() {
      const response = await fetch("/api/facets");
      const searchFacets = (await response.json()) as Facet[];
      setSearchFacets(searchFacets);
    }
    fetchSearchFacets();
  }, []);

  const facetGroups = Array.from(
    new Set(searchFacets.map((facet) => facet.facetGroup))
  );

  const filterItemProps: FilterItemProps[] = convertDataToFilterItemProps(
    searchFacets
  ).sort((f1, f2) => f2.groupKey.localeCompare(f1.groupKey));

  function isAnyGroupFilterApplied() {
    if (!queryParams) return false;
    return Array.from(queryParams.keys()).some(
      (key) =>
        key !== "page" &&
        key !== "q" &&
        facetGroups.some((group) => key.includes(group))
    );
  }

  function getQueryStringWithoutGroupFilter() {
    const filteredParamsQuery = Array.from(queryParams.keys())
      .filter(
        (x) => facetGroups.every((group) => !x.includes(group)) && x !== "page"
      )
      .map((x) => `&${x}=${queryParams.get(x)}`)
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
