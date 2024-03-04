// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./button";

type SearchBarProps = {
  queryParams: Record<string, string | string[] | undefined>;
};

function SearchBar({ queryParams }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
  }

  function handleClick(): void {
    const params = new URLSearchParams(queryParams as Record<string, string>);
    params.set("page", "1");
    if (!query) params.delete("q");
    else params.set("q", query);

    router.push(`${pathname}?${params}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    handleClick();
  }

  return (
    <form onSubmit={handleSubmit} className="text-sm">
      <div className="relative">
        <input
          placeholder="Search"
          className="h-11 w-full rounded-lg border-2 border-info bg-white-smoke px-4 py-[9px] shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-info"
          value={query}
          onChange={handleQueryChange}
        ></input>
        <div className="item-stretch absolute bottom-0 right-0 flex h-11 border-info">
          <Button
            text=""
            type="info"
            icon={faSearch}
            className="w-full rounded-lg border-info"
            onClick={handleClick}
          ></Button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
