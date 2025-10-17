// SPDX-FileCopyrightText: 2025 Center for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import GVariantsSearchBar, {
  SearchInputData,
} from "@/app/allele-frequency/GVariantsSearchBar";
import GVariantsTable from "@/app/allele-frequency/GVariantsTable";
import { searchGVariantsApi } from "@/app/api/discovery";
import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";
import ErrorComponent from "@/app/error";
import { UrlSearchParams } from "@/app/params";
import PageContainer from "@/components/PageContainer";
import { isAxiosError } from "axios";
import { use, useState } from "react";

type AlleleFrequencyPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default function AlleleFrequencyPage({
  searchParams,
}: AlleleFrequencyPageProps) {
  const [results, setResults] = useState<GVariantsSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [triedSearching, setTriedSearching] = useState(false);
  const _searchParams = use(searchParams);
  const [error, setError] = useState<{
    statusCode: number;
    title?: string;
    detail?: string;
  } | null>(null);

  const handleSearch = async (props: SearchInputData) => {
    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const [referenceName, start, referenceBases, alternateBases] =
        props.variant.split("-");
      const startPosition = start ? [parseInt(start)] : null;
      const response = await searchGVariantsApi({
        params: {
          referenceName,
          start: startPosition,
          end: null,
          referenceBases,
          alternateBases,
          assemblyId: props.refGenome,
        },
      });
      setResults(response);
      setTriedSearching(true);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        setError({
          statusCode: error.response.status,
          title: error.response.data.title,
          detail: error.response.data.detail,
        });
      } else {
        setError({ statusCode: 500 });
      }
    } finally {
      setLoading(false);
    }
  };
  if (error) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        errorTitle={error.title}
        errorDetail={error.detail}
      />
    );
  }

  return (
    <PageContainer
      searchParams={_searchParams}
      className="container mx-auto px-4 pt-5"
    >
      <GVariantsSearchBar onSearchAction={handleSearch} loading={loading} />

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && triedSearching && results.length == 0 && (
        <p className="text-center text-gray-500">No results found</p>
      )}

      {!loading && results.length > 0 && <GVariantsTable results={results} />}
    </PageContainer>
  );
}
