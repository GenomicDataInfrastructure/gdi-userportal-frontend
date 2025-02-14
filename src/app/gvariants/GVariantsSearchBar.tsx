// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// Reusable FormField component
type FormFieldProps = {
  label: string;
  type?: "text" | "select" | "number";
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

type GVariantsSearchBarProps = {
  onSearchAction: (inputData: SearchInputData) => void;
};

export type SearchInputData = {
  referenceName: string;
  start: string;
  end: string | undefined;
  referenceBase: string;
  alternateBase: string;
  refGenome: string;
  cohort: string;
};

export default function GVariantsSearchBar({
  onSearchAction,
}: GVariantsSearchBarProps) {
  const [searchData, setSearchData] = useState<SearchInputData>({
    referenceName: "3",
    start: "45864731",
    end: "",
    referenceBase: "T",
    alternateBase: "C",
    refGenome: "GRCh37",
    cohort: "All",
  });

  const handleChange = (field: keyof SearchInputData, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleButtonClick = () => {
    onSearchAction(searchData);
  };

  const formFields = [
    {
      label: "Ref Genome",
      key: "refGenome",
      type: "select",
      options: [
        { value: "GRCh37", label: "GRCh37" }
      ],
    },
    { label: "Start Position", key: "start", type:"number", placeholder: "e.g. 45864731" },
    { label: "End Position", key: "end", type:"number", placeholder: "e.g. 45864731" },
    { label: "Reference Name", key: "referenceName", placeholder: "e.g. 3" },
    { label: "Reference Base", key: "referenceBase", placeholder: "e.g. T" },
    { label: "Alternate Base", key: "alternateBase", placeholder: "e.g. C" },
    {
      label: "Cohort",
      key: "cohort",
      type: "select",
      options: [
        { value: "All", label: "All" },
        { value: "COVID", label: "COVID" },
      ],
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Search for your variant:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 items-end">
        {formFields.map(
          ({ label, key, type = "text", options, placeholder }) => (
            <FormField
              key={key}
              label={label}
              type={type as "text" | "select"}
              value={searchData[key as keyof SearchInputData] || ""}
              onChange={(value) =>
                handleChange(key as keyof SearchInputData, value)
              }
              options={options}
              placeholder={placeholder}
            />
          )
        )}

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
