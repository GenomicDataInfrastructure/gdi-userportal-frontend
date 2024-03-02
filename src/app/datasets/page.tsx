// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@/components/button";
import DatasetList from "@/components/datasetList";
import FilterList from "@/components/filterList";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/searchBar";
import { datasetList } from "@/services/ckan/index.server";
import { PackageSearchOptions } from "@/services/ckan/types/packageSearch.types";
import { faFilter, faX } from "@fortawesome/free-solid-svg-icons";
import { redirect } from "next/navigation";

async function DatasetPage({ searchParams }) {
  if (!searchParams.page) {
    redirect("/datasets?page=1");
  }
  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isFilterOpen = false;
  const DATASET_PER_PAGE = 12;
  // const { width } = useWindowSize();
  // const screenSize = pixelWidthToScreenSize(width);

  const options: PackageSearchOptions = {
    tags: [],
    orgs: [],
    groups: [],
    resFormat: [],
    offset: searchParams.page,
    limit: DATASET_PER_PAGE,
    query: searchParams.q || "",
    sort: "",
    include_private: false,
  };

  const datasets = await datasetList(options);

  // useEffect(() => {
  //   if (screenSize === SCREEN_SIZE.XL) setIsFilterOpen(false);
  // }, [screenSize]);

  return (
    <div className="mt-10 grid grid-cols-12 gap-x-12 gap-y-7">
      {isFilterOpen ? (
        <div className="relative col-span-10 col-start-2 rounded-lg border bg-white-smoke p-6">
          <FilterList displayContinueButton={true} />
          <Button
            icon={faX}
            className="absolute right-0 top-0 w-fit hover:bg-primary hover:text-white"
            text=""
            // onClick={() => setIsFilterOpen(false)}
          />
        </div>
      ) : (
        <>
          <div className="relative col-span-6 col-start-4 mb-12 mt-10 md:col-span-4 md:col-start-5">
            <SearchBar queryParams={searchParams} />
            <p className="mt-5 text-center text-sm text-info">
              {`${datasets.count} ${datasets.count > 1 ? "datasets" : "dataset"} found`}
            </p>
            <Button
              icon={faFilter}
              className="absolute -right-16 top-1 h-10 w-fit bg-white-smoke text-xs text-info hover:border-info md:text-xs xl:hidden"
              text=""
              // onClick={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>
          <div className="border-1 col-start-2 col-end-5 hidden rounded-lg border bg-white-smoke p-6 xl:block">
            <FilterList />
          </div>
          <div className="col-span-8 col-start-3 xl:col-span-6 xl:col-start-5">
            <DatasetList datasets={datasets.datasets} />
          </div>
          <div className="col-span-4 col-start-5 mt-20 text-info">
            <Pagination
              datasetCount={datasets.count}
              datasetPerPage={DATASET_PER_PAGE}
              pathname="/datasets"
              queryParams={searchParams}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default DatasetPage;
