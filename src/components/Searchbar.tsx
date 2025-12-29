// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { UrlSearchParams } from "@/app/params";

type SearchBarProps = {
  size?: "regular" | "large";
  searchParams: UrlSearchParams;
};

function SearchBar({ size, searchParams }: Readonly<SearchBarProps>) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { q: currentQuery } = searchParams;

  let sizeClass = "h-11";
  if (size === "large") {
    sizeClass = "h-14";
  }

  useEffect(() => {
    if (currentQuery) {
      setQuery(currentQuery);
    }
  }, [currentQuery]);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
  }
  useSearchParams();

  function redirectToSearchResults(query: string): void {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (!query) params.delete("q");
    else params.set("q", query);

    router.push(`/datasets?${params}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    redirectToSearchResults(query);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.preventDefault();
      redirectToSearchResults(query);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full text-sm">
      <div className="relative">
        <input
          placeholder="Search datasets"
          className={`${sizeClass} w-full rounded-lg px-4 py-[9px] shadow-xl ease-in-out hover:shadow-2xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-focus-ring focus:outline-none transition-all duration-300 ${
            isFocused ? "ring-2 ring-primary" : ""
          }`}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleEnter}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div
          className={`${sizeClass} item-stretch absolute bottom-0 right-0 flex`}
        >
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center rounded-r-lg bg-primary px-4 tracking-wide text-white transition-all duration-300 hover:bg-hover-color sm:w-auto"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
