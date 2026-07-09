/* SPDX-FileCopyrightText: 2025 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */
"use client";

import { FilterType } from "@/app/api/discovery/additional-types";
import { Filter } from "@/app/api/discovery/open-api/schemas";
import { useFilters } from "@/providers/filters/FilterProvider";
import { faChevronDown, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { default as DropdownFilterContent } from "./DropdownFilterContent";
import Tooltip from "@/app/datasets/[id]/Tooltip";
import EntriesFilterContent from "./EntriesFilterContent";
import FreeTextFilterContent from "./FreeTextFilterContent";
import DateTimeFilterContent from "./DateTimeFilterContent";
import NumberFilterContent from "./NumberFilterContent";

export type FilterItemProps = {
  filter: Filter;
};

function FilterItem({ filter }: FilterItemProps) {
  const t = useTranslations("datasets.filters");
  const { activeFilters } = useFilters();

  const correspondingActiveFilter = activeFilters.find(
    (activeFilter) =>
      activeFilter.key === filter.key && activeFilter.source === filter.source
  );
  const isFilterActive = correspondingActiveFilter !== undefined;
  const nbActiveValues =
    correspondingActiveFilter?.values?.length ||
    (correspondingActiveFilter?.entries && 1) ||
    0;

  const getFilterContent = (type: FilterType) => {
    switch (type) {
      case FilterType.DROPDOWN:
        return <DropdownFilterContent filter={filter} />;
      case FilterType.FREE_TEXT:
        return <FreeTextFilterContent filter={filter} />;
      case FilterType.ENTRIES:
        return <EntriesFilterContent filter={filter} />;
      case FilterType.DATETIME:
        return <DateTimeFilterContent filter={filter} />;
      case FilterType.NUMBER:
        return <NumberFilterContent filter={filter} />;
      default:
        throw new Error(`Unknown filter type: ${type}`);
    }
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="shadow-lg rounded-lg py-4 border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50">
        <Disclosure as="div">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between px-4 py-2 text-left">
                <div>
                  <span className="relative inline-flex items-center gap-x-2 group">
                    <span className="text-base px-1.5">{filter.label}</span>
                    {filter.helpText && (
                      <span
                        tabIndex={0}
                        aria-label={filter.helpText}
                        className="relative group inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
                      >
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="h-4 w-4 text-info"
                        />
                        <Tooltip message={filter.helpText} />
                      </span>
                    )}
                  </span>
                  <span className="text-base text-info">
                    {isFilterActive &&
                      t("activeCount", { count: nbActiveValues })}
                  </span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </Disclosure.Button>
              {getFilterContent(filter.type as FilterType)}
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default FilterItem;
