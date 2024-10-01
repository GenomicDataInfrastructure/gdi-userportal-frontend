// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import PageContainer from "@/components/PageContainer";
import FilterList from "./FilterList";
import SearchBar from "@/components/Searchbar";
import DatasetsProvider from "@/providers/datasets/DatasetsProvider";
import DatasetCount from "./DatasetCount";
import DatasetListContainer from "./DatasetListContainer";
import { redirect } from "next/navigation";
import { GET } from "../api/facets/route";
import { Facet } from "@/services/discovery/types/facets.type";
import Error from "@/app/error";
import AppliedFilters from "@/components/AppliedFilters";
import NoDatasetMessage from "./NoDatasetMessage";

export default async function DatasetsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams?.page) {
    redirect("/datasets?page=1");
  }

  const searchFacetsResponse = await GET();
  if (searchFacetsResponse.status !== 200) {
    return <Error statusCode={searchFacetsResponse.status} />;
  }

  const searchFacets = (await searchFacetsResponse.json()) as Facet[];

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
              <FilterList searchFacets={searchFacets} />
            </div>
          </div>
          <div className="col-start-0 col-span-4 flex flex-col gap-y-6">
            <div className="col-start-0 col-span-4 mr-6 hidden h-fit xl:block px-6">
              <FilterList searchFacets={searchFacets} />
            </div>
          </div>
          <div className="col-span-12 xl:col-span-8">
            <AppliedFilters searchFacets={searchFacets} />
            <NoDatasetMessage />
            <DatasetListContainer />
          </div>
        </DatasetsProvider>
      </div>
    </PageContainer>
  );
}
