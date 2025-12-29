// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { useFilters } from "@/providers/filters/FilterProvider";
import { ValueLabel } from "@/app/api/discovery/open-api/schemas";

interface ValueListProps {
  items: ValueLabel[];
  filterKey: string;
  title: string;
}

const ValueList: React.FC<ValueListProps> = ({ items, filterKey, title }) => {
  const { addActiveFilter } = useFilters();
  const validItems = items.filter(
    (item): item is typeof item & { value: string } => !!item.value
  );

  const handleClick = (value: ValueLabel) => {
    if (!value.value) return;
    addActiveFilter({
      key: filterKey,
      source: "ckan",
      type: "DROPDOWN",
      values: [{ value: value.value, label: value.label || value.value }],
      label: title,
    });
  };
  return (
    <div className="bg-white mb-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-center">
          {validItems.map((item) => (
            <div
              key={item.value}
              className="bg-white py-4 flex flex-col items-start justify-start rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-primary transition-all duration-300 hover:shadow-xl text-left w-full sm:max-w-[260px] card-hover"
            >
              <div className="p-4 h-full flex flex-col">
                <h3 className="text-lg truncate-lines-1 font-title mb-1">
                  {item.label}
                </h3>
                <div className="flex items-center mb-3 text-sm text-heading-secondary">
                  <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                  {item.count} {item.count === 1 ? "dataset" : "datasets"}
                </div>
                <div className="mt-auto text-sm">
                  <Link
                    onClick={() => handleClick(item)}
                    href={`/datasets?page=1`}
                    className="link-arrow text-primary hover:text-hover-color"
                  >
                    See datasets
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValueList;
