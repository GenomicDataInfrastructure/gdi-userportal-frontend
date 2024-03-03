// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import ClientWrapper from "@/app/datasets/ClientWrapper";
import { datasetList } from "@/services/ckan/index.server";
import { PackageSearchOptions } from "@/services/ckan/types/packageSearch.types";
import { redirect } from "next/navigation";

type DatasetPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

async function DatasetPage({ searchParams }: DatasetPageProps) {
  if (!searchParams?.page) {
    redirect("/datasets?page=1");
  }
  const DATASET_PER_PAGE = 12;

  function parseFilterValuesFromUrl(filterValues: string): string[] {
    return filterValues
      .slice(1, -1)
      .split(",")
      .map((value) => value.toLowerCase());
  }

  const options: PackageSearchOptions = {
    tags: searchParams?.keywords
      ? parseFilterValuesFromUrl(searchParams.keywords as string)
      : undefined,
    orgs: searchParams?.catalogues
      ? parseFilterValuesFromUrl(searchParams.catalogues as string)
      : undefined,
    groups: searchParams?.themes
      ? parseFilterValuesFromUrl(searchParams.themes as string)
      : undefined,
    publishers: searchParams?.publishers
      ? parseFilterValuesFromUrl(searchParams.publishers as string)
      : undefined,
    resFormat: [],
    offset: Number(searchParams?.page),
    limit: DATASET_PER_PAGE,
    query: searchParams?.q as string | undefined,
    sort: searchParams?.sort as string | undefined,
    include_private: false,
  };

  const datasets = await datasetList(options);

  return (
    <ClientWrapper
      queryParams={searchParams}
      datasets={datasets}
      datasetPerPage={DATASET_PER_PAGE}
    />
  );
}

export default DatasetPage;
