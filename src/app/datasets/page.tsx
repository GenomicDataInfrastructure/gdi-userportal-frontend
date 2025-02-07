// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { redirect } from "next/navigation";
import DatasetCount from "./DatasetCount";
import DatasetListContainer from "./DatasetListContainer";
import FilterList from "./FilterList";
import NoDatasetMessage from "./NoDatasetMessage";
import { useFilters } from "@/providers/filters/FilterProvider";
import { use } from "react";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import ActiveFilters from "@/app/datasets/ActiveFilters";
import DatasetsProvider from "@/providers/datasets/DatasetsProvider";
import Error from "@/app/error";
import { UrlSearchParams } from "@/app/params";

type DatasetsPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default function DatasetsPage({ searchParams }: DatasetsPageProps) {
  const _searchParams = use(searchParams);

  if (!_searchParams.page) {
    redirect("/datasets?page=1");
  }

  const currentPage = Number(_searchParams.page);

  const { error } = useFilters();

  if (error) {
    return <Error statusCode={error.statusCode} />;
  }

  return (
    <PageContainer searchParams={_searchParams}>
      <div className="grid grid-cols-12">
        <div className="col-start-0 col-span-12 flex items-center justify-between xl:col-span-10 xl:col-start-2">
          <SearchBar searchParams={_searchParams} />
        </div>
        <DatasetsProvider searchParams={_searchParams}>
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
            <DatasetListContainer currentPage={currentPage} />
          </div>
        </DatasetsProvider>
      </div>
    </PageContainer>
  );
}
