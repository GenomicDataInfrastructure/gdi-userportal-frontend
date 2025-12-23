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
              className="bg-white py-4 flex flex-col items-start justify-start rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50 text-left w-full sm:max-w-[260px]"
            >
              <div className="p-4 h-full flex flex-col">
                <h3 className="text-lg truncate-lines-1 font-title mb-1">
                  {item.label}
                </h3>
                <div className="flex items-center mb-3 text-sm">
                  <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                  {item.count} {item.count === 1 ? "dataset" : "datasets"}
                </div>
                <div className="mt-auto text-secondary flex items-center gap-1 transition hover:underline duration-1000 text-sm">
                  <Link
                    onClick={() => handleClick(item)}
                    href={`/datasets?page=1`}
                    className="flex items-center gap-1"
                  >
                    See datasets
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
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
