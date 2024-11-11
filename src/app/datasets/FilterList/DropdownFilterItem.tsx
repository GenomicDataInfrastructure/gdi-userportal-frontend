// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Disclosure } from "@headlessui/react";
import { FilterItemProps } from "./FilterItem";
import { useFilters } from "@/providers/FilterProvider";

type DropdownFilterContentProps = FilterItemProps;

export default function DropdownFilterContent({
  filter,
}: DropdownFilterContentProps) {
  const { activeFilters, addActiveFilter, removeActiveFilter } = useFilters();

  const correspondingActiveFilter = activeFilters.find(
    (f) => f.key === filter.key
  );

  const handleCheckboxChange = (
    value: string,
    label: string,
    checked: boolean
  ) => {
    const isFilterAlreadyActive = correspondingActiveFilter !== undefined;

    if (isFilterAlreadyActive) {
      const currentValues = correspondingActiveFilter.values as {
        value: string;
      }[];
      const newValues = checked
        ? [...currentValues, { value }]
        : currentValues.filter((v) => v.value !== value);

      if (!newValues.length) {
        removeActiveFilter(filter.key, filter.source);
        return;
      }

      const newActiveFilter = {
        ...correspondingActiveFilter,
        values: newValues,
      };
      addActiveFilter(newActiveFilter);
    } else {
      const newActiveFilter = {
        source: filter.source,
        type: filter.type,
        key: filter.key,
        label: filter.label,
        values: [{ value, label }],
      };
      addActiveFilter(newActiveFilter);
    }
  };

  const isChecked = (item: { value: string }) => {
    return correspondingActiveFilter
      ? correspondingActiveFilter
          ?.values!.map((v) => v.value)
          .includes(item.value)
      : false;
  };

  return (
    <Disclosure.Panel className="px-4 pb-2 pt-4 font-bryant font-normal flex flex-col gap-y-3 text-base border-t-2 border-t-primary max-h-80 overflow-y-auto">
      {filter.values!.length > 0 ? (
        filter.values!.map((item) => (
          <div
            key={item.value}
            className="flex items-center hover:bg-warning rounded-md p-2 cursor-pointer w-full transition-colors"
          >
            <input
              type="checkbox"
              className="h-4 w-4 border rounded-md checked:accent-warning flex-none"
              id={`${filter.source}-${item.value}`}
              value={item.value}
              checked={isChecked(item)}
              onChange={(e) =>
                handleCheckboxChange(item.value, item.label, e.target.checked)
              }
            />
            <label
              htmlFor={`${filter.source}-${item.value}`}
              className="ml-2.5 flex-1 cursor-pointer"
            >
              {item.label}
            </label>
          </div>
        ))
      ) : (
        <div className="text-center">No results found.</div>
      )}
    </Disclosure.Panel>
  );
}
