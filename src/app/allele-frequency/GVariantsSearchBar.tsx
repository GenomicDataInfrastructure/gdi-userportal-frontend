// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/Button";
import { COUNTRY_OPTIONS } from "@/app/api/discovery/additional-types";
import { faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Tooltip from "../datasets/[id]/Tooltip";

type FormFieldProps = {
  fieldKey: string;
  label: string;
  type?: "text" | "select" | "number";
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  tooltip?: string;
  placeholder?: string;
};

const FormField: React.FC<FormFieldProps> = ({
  fieldKey,
  label,
  type = "text",
  value,
  onChange,
  options,
  tooltip,
  placeholder,
}) => {
  return (
    <div className="col-span-1">
      <div className="flex flex-col">
        {tooltip && (
          <>
            <Tooltip message="Example value: 21-9411448-G-T" />
          </>
        )}

        <label
          htmlFor={fieldKey}
          className="flex gap-2 items-center justify-center font-semibold mb-1 w-fit"
        >
          <p>{label}</p>
          <div className="relative group">
            {tooltip && (
              <>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-lg text-info top-0"
                />
                <Tooltip message={tooltip} />
              </>
            )}
          </div>
        </label>
        {type === "select" ? (
          <select
            id={fieldKey}
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
            id={fieldKey}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-gray-300 p-2 rounded-sm w-full"
            placeholder={placeholder}
          />
        )}
      </div>
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
  sex: string;
  countryOfBirth: string;
};

const formFields = [
  {
    label: "Variant",
    fieldKey: "variant",
    type: "text",
    placeholder: "Search for a variant",
    tooltip:
      "The genomic variant in format: chromosome-position-reference-alternate (e.g., 21-9411448-G-T)",
  },
  {
    label: "Ref Genome",
    fieldKey: "refGenome",
    type: "select",
    options: [
      { value: "All", label: "All" },
      { value: "GRCh37", label: "GRCh37" },
    ],
  },
  {
    label: "Sex",
    fieldKey: "sex",
    type: "select",
    options: [
      { value: "All", label: "All" },
      { value: "M", label: "Male" },
      { value: "F", label: "Female" },
    ],
  },
  {
    label: "Country of Birth",
    fieldKey: "countryOfBirth",
    type: "select",
    options: [{ value: "All", label: "All" }, ...COUNTRY_OPTIONS],
  },
];

export default function GVariantsSearchBar({
  onSearchAction,
  loading,
}: GVariantsSearchBarProps) {
  const [searchFilterInput, setSearchFilterInput] = useState<SearchInputData>({
    variant: "",
    refGenome: "All",
    sex: "All",
    countryOfBirth: "All",
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

    onSearchAction(searchFilterInput);
  };
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Search for your variant:</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        {formFields.map(
          ({
            label,
            fieldKey: key,
            type = "text",
            options,
            tooltip,
            placeholder,
          }) => (
            <FormField
              key={key}
              fieldKey={key}
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

      <div className="text-md flex items-end gap-2 mt-2">
        <span className="text-black text-md">Variant Example: </span>
        <Button
          className="text-info hover:underline p-0 m-0"
          text="21-9411448-G-T"
          onClick={() => updateData("variant", "21-9411448-G-T")}
        />
      </div>

      {errorMessage && (
        <p className="text-red-500 text-md mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
