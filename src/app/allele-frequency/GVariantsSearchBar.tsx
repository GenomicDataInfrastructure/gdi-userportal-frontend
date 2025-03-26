// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/Button";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import Tooltip from "../datasets/[id]/Tooltip";

type FormFieldProps = {
  label: string;
  type?: "text" | "select" | "number";
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  tooltip?: string;
  placeholder?: string;
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  options,
  tooltip,
  placeholder,
}) => {
  return (
    <div className={`flex flex-col lg:col-span-2 md:col-span-1 col-span-1`}>
      <Tooltip message="Example value: 3-45864731-T-C" />

      <span className="flex gap-2 items-center relative group"></span>
      <label className="font-semibold mb-1 relative group w-fit">
        {label}
        {tooltip && <Tooltip message={tooltip} />}
      </label>
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
  variant: string;
  refGenome: string;
  cohort: string;
};

const formFields = [
  {
    label: "Variant",
    key: "variant",
    type: "text",
    placeholder: "e.g. 3-45864731-T-C",
    tooltip: "Example Value: 3-45864731-T-C",
  },
  {
    label: "Ref Genome",
    key: "refGenome",
    type: "select",
    options: [{ value: "GRCh37", label: "GRCh37" }],
  },
  {
    label: "Cohort",
    key: "cohort",
    type: "select",
    options: [
      { value: "All", label: "All" },
      { value: "COVID", label: "COVID" },
    ],
    tooltip: "A group of people with a shared characteristic",
  },
];

export default function GVariantsSearchBar({
  onSearchAction,
  loading,
}: GVariantsSearchBarProps) {
  const [searchFilterInput, setSearchFilterInput] = useState<SearchInputData>({
    variant: "",
    refGenome: "GRCh37",
    cohort: "All",
  });
  const [errorMessage, setErrorMessage] = useState("");

  function isVariantValid(variant: string) {
    if (!variant) {
      return true;
    }

    const variantPattern =
      /^[1-9]|1[0-9]|20|21|22|23|X-([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?-[ACGT]+-[ACGT]+$/;
    return variantPattern.test(variant);
  }

  const updateData = (field: keyof SearchInputData, value: string) => {
    setSearchFilterInput((prev) => {
      const updatedState = { ...prev, [field]: value };

      setErrorMessage(() =>
        isVariantValid(updatedState.variant)
          ? ""
          : "Incorrect variant information"
      );
      return updatedState;
    });
  };

  const search = () => {
    if (errorMessage) {
      return;
    }

    if (!searchFilterInput.variant) {
      setErrorMessage("Variant cannot be empty");
      return;
    }

    onSearchAction(searchFilterInput);
  };
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Search for your variant:</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-end">
        {formFields.map(
          ({ label, key, type = "text", options, tooltip, placeholder }) => (
            <FormField
              key={key}
              label={label}
              type={type as "text" | "select"}
              value={searchFilterInput[key as keyof SearchInputData] || ""}
              onChange={(value) =>
                updateData(key as keyof SearchInputData, value)
              }
              options={options}
              tooltip={tooltip}
              placeholder={placeholder}
            />
          )
        )}

        <div className="flex flex-col col-span-1">
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
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
}
