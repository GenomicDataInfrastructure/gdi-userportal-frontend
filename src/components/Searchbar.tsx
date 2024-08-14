// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SearchBarProps = {
  queryParams: URLSearchParams;
  size?: "regular" | "large";
};

function SearchBar({ queryParams, size }: SearchBarProps) {
  const [query, setQuery] = useState("");
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

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>): void {
    if (!e.target.value) {
      const params = new URLSearchParams(queryParams.toString());
      params.delete("q");
      router.push(`/datasets?${params}`);
    }
  }

  function redirectToSearchResults(query: string): void {
    const params = new URLSearchParams(queryParams.toString());
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
          className={`${sizeClass} w-full rounded-lg px-4 py-[9px] shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400`}
          value={query}
          onChange={handleQueryChange}
          onBlur={handleBlur}
          onKeyDown={handleEnter}
        ></input>
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
