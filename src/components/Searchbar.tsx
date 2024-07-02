// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { datasetList } from "@/services/discovery/index.public";

type SearchBarProps = {
  queryParams: URLSearchParams;
  size?: "regular" | "large";
};

type DatasetSuggestion = {
  id: string;
  title: string;
};

function SearchBar({ queryParams, size }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DatasetSuggestion[]>([]);
  const [fetchSuggestions, setFetchSuggestions] = useState(false);
  const router = useRouter();

  let sizeClass = "h-11";
  if (size === "large") {
    sizeClass = "h-14";
  }

  const q = queryParams.get("q");

  useEffect(() => {
    const initialQuery = Array.isArray(q) ? q[0] : q;
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [q]);

  useEffect(() => {
    if (fetchSuggestions && query.trim()) {
      const timeoutId = setTimeout(async () => {
        const result = await datasetList({ query, limit: 5 });
        setSuggestions(
          result.data?.datasets.map((dataset) => ({
            id: dataset.id,
            title: dataset.title,
          })),
        );
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [query, fetchSuggestions]);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
    setFetchSuggestions(true);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>): void {
    if (!e.target.value) {
      const params = new URLSearchParams(queryParams.toString());
      params.delete("q");
      router.push(`/datasets?${params}`);
    }
  }

  function redirectToSpecificDataset(datasetId: string): void {
    router.push(`/datasets/${datasetId}`);
  }

  function redirectToSearchResults(query: string): void {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", "1");
    if (!query) params.delete("q");
    else params.set("q", query);

    router.push(`/datasets?${params}`);
  }

  function handleSuggestionClick(suggestion: DatasetSuggestion) {
    setSuggestions([]);
    redirectToSpecificDataset(suggestion.id);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setFetchSuggestions(false);
    setSuggestions([]);
    redirectToSearchResults(query);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.preventDefault();
      setSuggestions([]);
      redirectToSearchResults(query);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full text-sm">
      <div className="relative">
        <input
          placeholder="Search"
          className={`${sizeClass} w-full rounded-lg border-2 border-primary px-4 py-[9px] shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary`}
          value={query}
          onChange={handleQueryChange}
          onBlur={handleBlur}
          onKeyDown={handleEnter}
        ></input>
        {suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-surface bg-white shadow-lg">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="w-full cursor-pointer px-4 py-2 text-left first:rounded-t-md last:rounded-b-md hover:bg-primary hover:text-white"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.title}
              </button>
            ))}
          </div>
        )}
        <div
          className={`${sizeClass} item-stretch absolute bottom-0 right-0 flex border-primary`}
        >
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center rounded-r-lg bg-primary px-4 tracking-wide text-white transition-colors duration-200 hover:bg-secondary sm:w-auto"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
