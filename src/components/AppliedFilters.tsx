/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */
"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ClearFilterButton from "@/app/datasets/FilterList/ClearFilterButton";
import {
  FilterItemProps,
  convertDataToFilterItemProps,
} from "@/utils/convertDataToFilterItemProps";
import { Facet } from "@/services/discovery/types/facets.type";

const AppliedFilters = ({ searchFacets }: { searchFacets: Facet[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filterItemProps: FilterItemProps[] = React.useMemo(() => {
    return convertDataToFilterItemProps(searchFacets);
  }, [searchFacets]);

  const appliedFilters = React.useMemo(() => {
    if (!searchParams) return [];

    return Array.from(searchParams.entries())
      .filter(([key]) => key !== "page" && key.includes("-"))
      .map(([key, value]) => {
        const [groupKey, field] = key.split("-");
        const filterItem = filterItemProps.find(
          (item) => item.groupKey === groupKey && item.field === field
        );
        return {
          groupKey,
          field,
          values: value.split(",").map((val) => ({
            value: val,
            label:
              filterItem?.data.find((option) => option.value === val)?.label ||
              val,
          })),
          label: filterItem?.label || field,
        };
      });
  }, [searchParams, filterItemProps]);

  const facetGroups = React.useMemo(() => {
    return Array.from(new Set(appliedFilters.map((filter) => filter.groupKey)));
  }, [appliedFilters]);

  const handleRemoveFilter = (
    groupKey: string,
    field: string,
    value: string
  ) => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(`${groupKey}-${field}`)?.split(",") || [];
    const newValues = currentValues.filter((v) => v !== value);

    if (newValues.length > 0) {
      params.set(`${groupKey}-${field}`, newValues.join(","));
    } else {
      params.delete(`${groupKey}-${field}`);
    }

    params.set("page", "1");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  if (appliedFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-subheading">Applied Filters</h3>
        <ClearFilterButton facetGroups={facetGroups} />
      </div>
      <div className="flex flex-wrap gap-2">
        {appliedFilters.flatMap(({ groupKey, field, values, label }) =>
          values.map(({ value, label: valueLabel }) => (
            <div
              key={`${groupKey}-${field}-${value}`}
              className="flex items-center gap-2 bg-surface rounded-lg px-3 py-1"
            >
              <span className="font-body text-md">
                {label}: {valueLabel}
              </span>
              <button
                onClick={() => handleRemoveFilter(groupKey, field, value)}
                className="text-info hover:text-secondary"
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppliedFilters;
