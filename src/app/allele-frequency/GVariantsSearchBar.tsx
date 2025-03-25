// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import React, { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";

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
          className="border border-gray-300 p-2 rounded-sm w-full"
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
          className="border border-gray-300 p-2 rounded-sm w-full"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

type GVariantsSearchBarProps = {
  onSearchAction: (inputData: SearchInputData) => void;
  loading: boolean;
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
const formFields = [
  {
    label: "Ref Genome",
    key: "refGenome",
    type: "select",
    options: [{ value: "GRCh37", label: "GRCh37" }],
  },
  {
    label: "Start Position",
    key: "start",
    type: "number",
    placeholder: "e.g. 45864731",
  },
  {
    label: "End Position",
    key: "end",
    type: "number",
    placeholder: "e.g. 45864731",
  },
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
export default function GVariantsSearchBar({
  onSearchAction,
  loading,
}: GVariantsSearchBarProps) {
  const [searchFilterInput, setSearchFilterInput] = useState<SearchInputData>({
    referenceName: "3",
    start: "45864731",
    end: "",
    referenceBase: "T",
    alternateBase: "C",
    refGenome: "GRCh37",
    cohort: "All",
  });

  const updateData = (field: keyof SearchInputData, value: string) => {
    setSearchFilterInput((prev) => ({ ...prev, [field]: value }));
  };

  const search = () => {
    onSearchAction(searchFilterInput);
  };
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
              value={searchFilterInput[key as keyof SearchInputData] || ""}
              onChange={(value) =>
                updateData(key as keyof SearchInputData, value)
              }
              options={options}
              placeholder={placeholder}
            />
          )
        )}

        <div className="flex flex-col">
          <Button
            disabled={loading}
            icon={faSearch}
            onClick={search}
            text="Search"
            type="primary"
            className="text-center"
          />
        </div>
      </div>
    </div>
  );
}
