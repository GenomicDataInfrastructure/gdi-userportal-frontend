// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
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

type ErrorState = {
  statusCode: number;
  title?: string;
  detail?: string;
};

type AlleleFrequencyPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

const FILTER_DEFAULTS: Record<keyof SearchInputData, string> = {
  variant: "",
  refGenome: "GRCh37",
  cohort: "All",
  sex: "All",
  countryOfBirth: "All",
};

export default function AlleleFrequencyPage({
  searchParams,
}: AlleleFrequencyPageProps) {
  const [results, setResults] = useState<GVariantsSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [triedSearching, setTriedSearching] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const _searchParams = use(searchParams);

  const buildSearchParams = (input: SearchInputData): Record<string, any> => {
    const [referenceName, , referenceBases, alternateBases] =
      input.variant.split("-");

    const params: Record<string, any> = {
      referenceName,
      referenceBases,
      alternateBases,
      assemblyId: input.refGenome,
    };

    // Add optional filters only if user selected a non-default value
    if (input.sex && input.sex !== FILTER_DEFAULTS.sex && input.sex !== "All") {
      params.sex = input.sex;
    }
    if (
      input.countryOfBirth &&
      input.countryOfBirth !== FILTER_DEFAULTS.countryOfBirth &&
      input.countryOfBirth !== "All"
    ) {
      params.countryOfBirth = input.countryOfBirth;
    }
    if (input.cohort && input.cohort !== FILTER_DEFAULTS.cohort) {
      params.cohort = input.cohort;
    }

    return params;
  };

  const handleSearch = async (props: SearchInputData) => {
    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const params = buildSearchParams(props);
      const response = await searchGVariantsApi({ params });
      setResults(response);
      setTriedSearching(true);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setError({
          statusCode: error.response.status,
          title: error.response.data?.title,
          detail: error.response.data?.detail,
        });
      } else {
        setError({ statusCode: 500 });
      }
      setTriedSearching(true);
    } finally {
      setLoading(false);
    }
  };

  if (error && !triedSearching) {
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

      {error && triedSearching && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800 font-semibold">
            {error.title || "Search Error"}
          </p>
          {error.detail && (
            <p className="text-red-700 text-sm mt-1">{error.detail}</p>
          )}
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && triedSearching && results.length === 0 && !error && (
        <p className="text-center text-gray-500">No results found</p>
      )}

      {!loading && results.length > 0 && <GVariantsTable results={results} />}
    </PageContainer>
  );
}
