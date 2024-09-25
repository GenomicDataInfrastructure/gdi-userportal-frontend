// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SearchBarProps = {
  size?: "regular" | "large";
};

function SearchBar({ size }: Readonly<SearchBarProps>) {
  const queryParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  let sizeClass = "h-11";
  if (size === "large") {
    sizeClass = "h-14";
  }

  const q = queryParams?.get("q");

  useEffect(() => {
    const initialQuery = Array.isArray(q) ? q[0] : q;
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [q]);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
  }

  function redirectToSearchResults(query: string): void {
    const params = new URLSearchParams(queryParams?.toString() || "");
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
          className={`${sizeClass} w-full rounded-lg px-4 py-[9px] shadow-xl ease-in-out hover:shadow-2xl ${
            isFocused ? "ring-2 focus:outline ring-primary" : ""
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
