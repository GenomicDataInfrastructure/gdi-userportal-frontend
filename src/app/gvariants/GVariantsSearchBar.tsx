// SPDX-License-IdentifierText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type GVariantsSearchBarProps = {
  onSearchAction: (inputData: SearchInputData) => void;
};

export type SearchInputData = {
  chromosome: string;
  start: string;
  end: string | undefined;
  referenceBase: string;
  alternateBase: string;
  refGenome: string;
  cohort: string;
}

export default function GVariantsSearchBar({ onSearchAction }: GVariantsSearchBarProps) {
  const [chromosome, setChromosome] = useState("3");
  const [start, setStart] = useState("45864731");
  const [end, setEnd] = useState<string>();
  const [referenceBase, setReferenceBase] = useState("T");
  const [alternateBase, setAlternateBase] = useState("C");
  const [refGenome, setRefGenome] = useState("GRCh37");
  const [cohort, setCohort] = useState("All");

  const handleButtonClick = () => {
    onSearchAction({
      chromosome,
      start,
      end,
      referenceBase,
      alternateBase,
      refGenome,
      cohort
    });
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Search for your variant:</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 items-end">
        {/* Chromosome */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Chromosome</label>
          <input
            type="text"
            value={chromosome}
            onChange={(e) => setChromosome(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="e.g. 3"
          />
        </div>

        {/* Start Position */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Start Position</label>
          <input
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="e.g. 45864731"
          />
        </div>

        {/* End Position */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">End Position</label>
          <input
            type="text"
            onChange={(e) => setEnd(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="e.g. 45864731"
          />
        </div>

        {/* Reference Base */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Reference Base</label>
          <input
            type="text"
            value={referenceBase}
            onChange={(e) => setReferenceBase(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="e.g. T"
          />
        </div>

        {/* Alternate Base */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Alternate Base</label>
          <input
            type="text"
            value={alternateBase}
            onChange={(e) => setAlternateBase(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="e.g. C"
          />
        </div>

        {/* Reference Genome */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Ref Genome</label>
          <select
            value={refGenome}
            onChange={(e) => setRefGenome(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="GRCh37">GRCh37</option>
            <option value="GRCh3">GRCh38</option>
          </select>
        </div>

        {/* Cohort (if you need it) */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Cohort</label>
          <select
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="All">All</option>
            <option value="Cohort1">COVID</option>
            {/* Add more as needed */}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex flex-col">
          <button
            onClick={handleButtonClick}
            className="flex items-center justify-center bg-[#6B214F] text-white px-6 py-2 rounded hover:bg-[#5A1A42] transition w-full sm:w-auto"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
