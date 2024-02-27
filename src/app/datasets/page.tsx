// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import DatasetList from "@/components/datasetList";
import FilterList from "@/components/filterList";
import Pagination from "@/components/pagination";
import Search from "@/components/search";

function DatasetPage() {
  return (
    <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-7">
      <div className="col-span-4 col-start-5 mb-12 mt-10">
        <Search />
        <p className="mt-5 text-center text-sm text-info">3 results found</p>
      </div>
      <div className="col-start-2 col-end-5 hidden rounded-lg border-2 bg-white-smoke p-6 xl:block">
        <FilterList />
      </div>
      <div className="col-span-8 col-start-3 xl:col-span-6 xl:col-start-5">
        <DatasetList />
      </div>
      <div className="col-span-4 col-start-5 mt-20 w-full text-xs text-info">
        <Pagination />
      </div>
    </div>
  );
}

export default DatasetPage;
