"use client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Button from "./button";

export default function Search() {
  const [query, setQuery] = useState("");

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl text-sm">
      <div className="absolute mx-auto w-full max-w-xl">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-[10px] text-lg text-gray-500"
        />
        <input
          placeholder="Find the dataset you need..."
          className="w-full rounded-lg border-[1px] bg-white-smoke px-12 py-[9px] shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-info"
          value={query}
          onChange={handleQueryChange}
        ></input>
        <div className="absolute right-0 top-[10px]">
          <Button text="Search" type="info"></Button>
        </div>
      </div>
    </form>
  );
}
