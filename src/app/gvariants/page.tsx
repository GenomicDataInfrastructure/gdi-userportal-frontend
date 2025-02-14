// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { use, useState } from "react";
import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";
import { UrlSearchParams } from "@/app/params";
import { searchGVariantsApi } from "@/app/api/discovery";
import PageContainer from "@/components/PageContainer";
import React from "react";
import GVariantsSearchBar, {
  SearchInputData,
} from "@/app/gvariants/GVariantsSearchBar";
import GVariantsTable from "@/app/gvariants/GVariantsTable";

type GVariantsPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default function GVariantsPage({ searchParams }: GVariantsPageProps) {
  const [results, setResults] = useState<GVariantsSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [triedSearching, setTriedSearching] = useState(false);
  const _searchParams = use(searchParams);

  const handleSearch = async (props: SearchInputData) => {
    setLoading(true);
    setResults([]);
    try {
      const endPosition = props.end ? [parseInt(props.end)] : null;
      const startPosition = props.start ? [parseInt(props.start)] : null;
      const response = await searchGVariantsApi({
        params: {
          referenceName: props.referenceName,
          start: startPosition,
          end:  endPosition,
          referenceBases: props.referenceBase,
          alternateBases: props.alternateBase,
          assemblyId: props.refGenome,
        },
      });
      setResults(response);
      setTriedSearching(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      searchParams={_searchParams}
      className="container mx-auto px-4 pt-5"
    >
      <GVariantsSearchBar onSearchAction={handleSearch} />

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && triedSearching && results.length == 0 && (
        <p className="text-center text-gray-500">No results found</p>
      )}

      {/* Results Table */}
      {!loading && results.length > 0 && <GVariantsTable results={results} />}
    </PageContainer>
  );
}
