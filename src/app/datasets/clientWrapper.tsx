// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Button from "@/components/button";
import DatasetList from "@/components/datasetList";
import FilterList from "@/components/filterList";
import PaginationContainer from "@/components/paginationContainer";
import SearchBar from "@/components/searchBar";
import { useWindowSize } from "@/hooks";
import { FieldDetails } from "@/services/ckan/types/fieldDetails.types";
import { PackageSearchResult } from "@/services/ckan/types/packageSearch.types";
import { SCREEN_SIZE, pixelWidthToScreenSize } from "@/utils/windowSize";
import { faFilter, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

type ClientWrapperProps = {
  datasets: PackageSearchResult;
  datasetPerPage: number;
  queryParams: Record<string, string>;
  filterData: FieldDetails[];
};

export default function ClientWrapper({
  datasets,
  datasetPerPage,
  queryParams,
  filterData,
}: ClientWrapperProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { width } = useWindowSize();
  const screenSize = pixelWidthToScreenSize(width);

  useEffect(() => {
    if (screenSize === SCREEN_SIZE.XL) setIsFilterOpen(false);
  }, [screenSize]);

  return (
    <div className="mt-10 grid grid-cols-12 gap-x-12 gap-y-7">
      {isFilterOpen ? (
        <div className="relative col-span-10 col-start-2 rounded-lg border bg-white-smoke p-6">
          <FilterList
            filterData={filterData}
            displayContinueButton={true}
            setIsFilterOpen={setIsFilterOpen}
            queryParams={queryParams}
          />
          <Button
            icon={faX}
            className="absolute right-0 top-0 w-fit hover:bg-primary hover:text-white"
            text=""
            onClick={() => setIsFilterOpen(false)}
          />
        </div>
      ) : (
        <>
          <div className="relative col-span-6 col-start-4 mb-12 mt-10 md:col-span-4 md:col-start-5">
            <SearchBar queryParams={queryParams} />
            <p className="mt-5 text-center text-sm text-info">
              {`${datasets.count} ${datasets.count > 1 ? "datasets" : "dataset"} found`}
            </p>
            <Button
              icon={faFilter}
              className="absolute -right-16 top-1 h-10 w-fit bg-white-smoke text-xs text-info hover:border-info md:text-xs xl:hidden"
              text=""
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>
          <div className="border-1 col-start-2 col-end-5 hidden rounded-lg border bg-white-smoke p-6 xl:block">
            <FilterList
              filterData={filterData}
              setIsFilterOpen={setIsFilterOpen}
              queryParams={queryParams}
            />
          </div>
          <div className="col-span-8 col-start-3 xl:col-span-6 xl:col-start-5">
            <DatasetList datasets={datasets.datasets} />
          </div>
          <div className="col-span-4 col-start-5 mt-20 text-info">
            <PaginationContainer
              datasetCount={datasets.count}
              datasetPerPage={datasetPerPage}
              pathname="/datasets"
              queryParams={queryParams}
            />
          </div>
        </>
      )}
    </div>
  );
}
