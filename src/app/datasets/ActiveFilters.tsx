// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import ClearFilterButton from "@/app/datasets/FilterList/ClearFilterButton";
import { useFilters } from "@/providers/filters/FilterProvider";
import ActiveFilterPill from "@/app/datasets/ActiveFilterPill";
import { FilterType } from "@/app/api/discovery/additional-types";
import {
  ActiveFilter,
  ActiveFilterEntry,
} from "@/providers/filters/FilterProvider.types";

export default function ActiveFilters() {
  const { activeFilters, addActiveFilter, removeActiveFilter } = useFilters();

  if (!activeFilters.length) {
    return null;
  }

  const removeActiveValue = (
    activeFilter: ActiveFilter,
    valueToRemove: string,
    operator?: string
  ): void => {
    const newActiveFilter = {
      ...activeFilter,
      values: activeFilter.values!.filter(
        (v) => v.value !== valueToRemove || v.operator !== operator
      ),
    };

    if (!newActiveFilter.values.length) {
      removeActiveFilter(activeFilter.key, activeFilter.source);
    } else {
      addActiveFilter(newActiveFilter);
    }
  };

  const formatEntries = (entries: ActiveFilterEntry[]): string => {
    return `{ ${entries.map((e) => `${e.label}: ${e.value}`).join(", ")} }`;
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-subheading">Active Filters</h3>
        <ClearFilterButton />
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((f) => {
          if (f.type === FilterType.ENTRIES) {
            return (
              <ActiveFilterPill
                key={`${f.source}-${f.key}`}
                onRemove={() => removeActiveFilter(f.key, f.source)}
              >
                {`${f.label}: ${formatEntries(f.entries!)}`}
              </ActiveFilterPill>
            );
          } else {
            return f.values!.map((v) => (
              <ActiveFilterPill
                key={`${f.source}-${f.key}-${v.value}-${v.operator}`}
                onRemove={() => removeActiveValue(f, v.value, v.operator)}
              >
                {`${f.label} ${v.operator || ":"} ${v.label}`}
              </ActiveFilterPill>
            ));
          }
        })}
      </div>
    </div>
  );
}
