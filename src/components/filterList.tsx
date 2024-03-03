// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { type FieldDetails } from "@/services/ckan/types/fieldDetails.types";
import {
  faBook,
  faFilter,
  faMagnifyingGlass,
  faTags,
  faUser,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Button from "./button";
import FilterItem, { FilterItemProps } from "./filterItem";

const fieldToIconMap: Record<string, IconDefinition> = {
  publisher: faUser,
  catalogue: faBook,
  theme: faTags,
  keyword: faMagnifyingGlass,
};

function convertDataToFilterItemProps(data: FieldDetails[]): FilterItemProps[] {
  return data.map((fieldDetails: FieldDetails) => {
    return {
      label:
        fieldDetails.field.charAt(0).toUpperCase() +
        fieldDetails.field.slice(1) +
        "s",
      data: fieldDetails.values.map((v: string) => {
        return {
          label: v.charAt(0).toUpperCase() + v.slice(1),
          value: v,
        };
      }),
      icon: fieldToIconMap[fieldDetails.field],
    };
  });
}

type FilterListProps = {
  filterData: FieldDetails[];
  displayContinueButton?: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  queryParams: Record<string, string | string[] | undefined>;
};

function FilterList({
  filterData,
  displayContinueButton = false,
  setIsFilterOpen,
  queryParams,
}: FilterListProps) {
  const filterItemProps: FilterItemProps[] =
    convertDataToFilterItemProps(filterData);

  function isAnyFilterApplied() {
    if (!queryParams) return false;
    return Object.keys(queryParams).some(
      (key) => key !== "page" && key !== "q" && queryParams[key],
    );
  }

  return (
    <div className="flex flex-col gap-y-10 rounded-lg bg-white-smoke px-6 py-8">
      <h1 className="text-xl">
        <span className="mr-2">
          <FontAwesomeIcon icon={faFilter} />
        </span>
        Filters
      </h1>
      {filterItemProps.map((props) => (
        <li key={props.label} className="list-none">
          <FilterItem label={props.label} data={props.data} icon={props.icon} />
        </li>
      ))}
      <div className="mt-4 flex justify-between">
        {isAnyFilterApplied() && (
          <Link
            href={`/datasets?page=1${queryParams.q ? `&q=${queryParams.q}` : ""}`}
          >
            <Button
              text="Clear Filters"
              type="primary"
              className="w-fit text-xs"
            />
          </Link>
        )}
        {displayContinueButton && (
          <Button
            text="Continue"
            type="info"
            className="w-fit text-xs"
            onClick={() => setIsFilterOpen(false)}
          ></Button>
        )}
      </div>
    </div>
  );
}

export default FilterList;
