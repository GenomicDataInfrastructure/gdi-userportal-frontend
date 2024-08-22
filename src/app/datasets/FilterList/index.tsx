// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  FilterItemProps,
  convertDataToFilterItemProps,
} from "@/utils/convertDataToFilterItemProps";
import { FacetGroup } from "@/services/discovery/types/datasetSearch.types";
import Button from "@/components/Button";
import FilterItem from "./FilterItem";

type FilterListProps = {
  toggleFullScreenFilter?: React.Dispatch<React.SetStateAction<boolean>>;
  queryParams: URLSearchParams;
  facetGroup: FacetGroup;
};

function FilterList({
  toggleFullScreenFilter,
  queryParams,
  facetGroup,
}: FilterListProps) {
  const filterItemProps: FilterItemProps[] =
    convertDataToFilterItemProps(facetGroup);

  function isAnyGroupFilterApplied() {
    if (!queryParams) return false;
    return Array.from(queryParams.keys()).some(
      (key) => key !== "page" && key !== "q" && key.includes(facetGroup.key)
    );
  }

  function getQueryStringWithoutGroupFilter() {
    const filteredParamsQuery = Array.from(queryParams.keys())
      .filter((x) => !x.includes(facetGroup.key) && x !== "page")
      .map((x) => `&${x}=${queryParams.get(x)}`)
      .join("");

    return filteredParamsQuery;
  }

  return (
    <div className="flex flex-col gap-y-10">
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
      {isAnyGroupFilterApplied() || toggleFullScreenFilter ? (
        <div className="mt-4 flex justify-end gap-x-4">
          {isAnyGroupFilterApplied() && (
            <Button
              href={`/datasets?page=1${getQueryStringWithoutGroupFilter()}`}
              text="Clear Filters"
              type="warning"
            />
          )}
          {toggleFullScreenFilter && (
            <Button
              text="Continue"
              type="info"
              onClick={() => toggleFullScreenFilter(false)}
            ></Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default FilterList;
