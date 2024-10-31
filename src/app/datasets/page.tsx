// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import Error from "@/app/error";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import DatasetsProvider from "@/providers/datasets/DatasetsProvider";
import {redirect, useSearchParams} from "next/navigation";
import DatasetCount from "./DatasetCount";
import DatasetListContainer from "./DatasetListContainer";
import FilterList from "./FilterList";
import NoDatasetMessage from "./NoDatasetMessage";
import { useFilters } from "@/providers/FilterProvider";
import ActiveFilters from "@/components/ActiveFilters";

export default function DatasetsPage() {
  const searchParams = useSearchParams() as URLSearchParams;

  if (!searchParams.get("page")) {
    redirect("/datasets?page=1");
  }

  const { error } = useFilters();

  if (error) {
    return <Error statusCode={error.statusCode} />;
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-12">
        <div className="col-start-0 col-span-12 flex items-center justify-between xl:col-span-10 xl:col-start-2">
          <SearchBar />
        </div>
          <DatasetsProvider>
            <DatasetCount />
            <div className="col-start-0 col-span-12 flex flex-col gap-4 sm:block xl:hidden">
              <div className="my-4 h-fit">
                <FilterList />
              </div>
            </div>
            <div className="col-start-0 col-span-4 flex flex-col gap-y-6">
              <div className="col-start-0 col-span-4 mr-6 hidden h-fit xl:block px-6">
                <FilterList />
              </div>
            </div>
            <div className="col-span-12 xl:col-span-8">
               <ActiveFilters />
              <NoDatasetMessage />
              <DatasetListContainer />
            </div>
          </DatasetsProvider>
      </div>
    </PageContainer>
  );
}
