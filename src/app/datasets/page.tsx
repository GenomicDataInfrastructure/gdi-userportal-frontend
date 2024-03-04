// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import ClientWrapper from "@/app/datasets/clientWrapper";
import { datasetList, fieldDetailsGet } from "@/services/ckan/index.server";
import { Field } from "@/services/ckan/types/fieldDetails.types";
import { PackageSearchOptions } from "@/services/ckan/types/packageSearch.types";
import { parseFilterValuesSingleQueryString } from "@/utils/textProcessing";
import { redirect } from "next/navigation";

type DatasetPageProps = {
  searchParams: Record<string, string>;
};

async function DatasetPage({ searchParams }: DatasetPageProps) {
  if (!searchParams?.page) {
    redirect("/datasets?page=1");
  }
  const DATASET_PER_PAGE = 12;

  const options: PackageSearchOptions = {
    tags: searchParams.keywords
      ? parseFilterValuesSingleQueryString(searchParams.keywords as string)
      : undefined,
    orgs: searchParams.catalogues
      ? parseFilterValuesSingleQueryString(searchParams.catalogues as string)
      : undefined,
    groups: searchParams.themes
      ? parseFilterValuesSingleQueryString(searchParams.themes as string)
      : undefined,
    publishers: searchParams.publishers
      ? parseFilterValuesSingleQueryString(searchParams.publishers as string)
      : undefined,
    resFormat: [],
    offset: searchParams.page ? Number(searchParams.page) - 1 : 0,
    limit: DATASET_PER_PAGE,
    query: searchParams?.q as string | undefined,
    sort: searchParams?.sort as string | "relevance",
    include_private: false,
  };

  const datasets = await datasetList(options);

  const filterData = await Promise.all([
    fieldDetailsGet(Field.PUBLISHER),
    fieldDetailsGet(Field.CATALOGUE),
    fieldDetailsGet(Field.THEME),
    fieldDetailsGet(Field.KEYWORD),
  ]);

  return (
    <ClientWrapper
      queryParams={searchParams}
      datasets={datasets}
      datasetPerPage={DATASET_PER_PAGE}
      filterData={filterData}
    />
  );
}

export default DatasetPage;
