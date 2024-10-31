// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ClearFilterButton from "@/app/datasets/FilterList/ClearFilterButton";
import { useFilters } from "@/providers/FilterProvider";
import {ActiveFilter} from "@/services/discovery/types/filter.type";

export default function ActiveFilters() {
  const { activeFilters, addActiveFilter, removeActiveFilter } = useFilters();

  if (!activeFilters.length) {
    return null;
  }

  const removeActiveValue = (activeFilter: ActiveFilter, valueToRemove: string, operator?: string): void => {
    const newActiveFilter = {
      ...activeFilter,
      values: activeFilter.values!.filter(v => v.value !== valueToRemove || v.operator !== operator)
    }

    if (!newActiveFilter.values.length) {
      removeActiveFilter(activeFilter.key, activeFilter.source);
    } else {
      addActiveFilter(newActiveFilter);
    }
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-subheading">Active Filters</h3>
        <ClearFilterButton />
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(f=> (
          f.values!.map(v =>
            <div
              key={`${f.source}-${f.key}-${v.value}-${v.operator}`}
              className="flex items-center gap-2 bg-surface rounded-lg px-3 py-1"
            >
              <span className="font-body text-md">
                {`${f.label} ${v.operator || ":"} ${v.label ?? v.value}`}
              </span>
              <button
                onClick={() => removeActiveValue(f, v.value, v.operator)}
                className="text-info hover:text-secondary"
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4"/>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
