/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */
"use client";

import { Filter, FilterType } from "@/services/discovery/types/filter.type";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { default as DropdownFilterContent } from "./DropdownFilterItem";
import FreeTextFilterContent from "./FreeTextFilterItem";

export type FilterItemProps = {
  filter: Filter;
};

function FilterItem({ filter }: FilterItemProps) {
  const getFilterContent = (type: FilterType) => {
    switch (type) {
      case FilterType.DROPDOWN:
        return <DropdownFilterContent filter={filter} />;
      case FilterType.FREE_TEXT:
        return <FreeTextFilterContent filter={filter} />;
      case FilterType.ENTRIES:
        return <div>Entries</div>;
      default:
        throw new Error(`Unknown filter type: ${type}`);
    }
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="shadow-lg rounded-lg py-4 border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between px-4 py-2 text-left">
                <span className="text-base px-1.5">{filter.label}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </Disclosure.Button>
              {getFilterContent(filter.type)}
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default FilterItem;
