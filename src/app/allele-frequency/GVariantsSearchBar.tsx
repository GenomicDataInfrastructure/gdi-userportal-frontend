// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/Button";
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
    <div className="flex flex-col">
      <label
        htmlFor={fieldKey}
        className="flex gap-2 items-center font-semibold mb-1 w-fit"
      >
        <p>{label}</p>
        {tooltip && (
          <div className="relative group">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-lg text-info"
            />
            <Tooltip message={tooltip} />
          </div>
        )}
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
  sex: string;
  countryOfBirth: string;
};

interface FilterOption {
  value: string;
  label: string;
}

interface FormFieldConfig {
  label: string;
  fieldKey: keyof SearchInputData;
  type: "text" | "select";
  options?: FilterOption[];
  placeholder?: string;
  tooltip?: string;
  defaultValue?: string;
}

const EU_COUNTRIES: FilterOption[] = [
  { value: "aut", label: "Austria" },
  { value: "bel", label: "Belgium" },
  { value: "bgr", label: "Bulgaria" },
  { value: "hrv", label: "Croatia" },
  { value: "cyp", label: "Cyprus" },
  { value: "cze", label: "Czech Republic" },
  { value: "dnk", label: "Denmark" },
  { value: "est", label: "Estonia" },
  { value: "fin", label: "Finland" },
  { value: "fra", label: "France" },
  { value: "deu", label: "Germany" },
  { value: "grc", label: "Greece" },
  { value: "hun", label: "Hungary" },
  { value: "irl", label: "Ireland" },
  { value: "ita", label: "Italy" },
  { value: "lva", label: "Latvia" },
  { value: "ltu", label: "Lithuania" },
  { value: "lux", label: "Luxembourg" },
  { value: "mlt", label: "Malta" },
  { value: "nld", label: "Netherlands" },
  { value: "pol", label: "Poland" },
  { value: "prt", label: "Portugal" },
  { value: "rou", label: "Romania" },
  { value: "svk", label: "Slovakia" },
  { value: "svn", label: "Slovenia" },
  { value: "esp", label: "Spain" },
  { value: "swe", label: "Sweden" },
];

const FORM_FIELDS_CONFIG: FormFieldConfig[] = [
  {
    label: "Variant",
    fieldKey: "variant",
    type: "text",
    placeholder: "Search for a variant",
    defaultValue: "",
  },
  {
    label: "Ref Genome",
    fieldKey: "refGenome",
    type: "select",
    options: [{ value: "GRCh37", label: "GRCh37" }],
    defaultValue: "GRCh37",
  },
  {
    label: "Cohort",
    fieldKey: "cohort",
    type: "select",
    options: [
      { value: "All", label: "All" },
      { value: "COVID", label: "COVID" },
    ],
    tooltip: "A group of people with a shared characteristic",
    defaultValue: "All",
  },
  {
    label: "Sex",
    fieldKey: "sex",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
      { value: "OTHER", label: "Other" },
    ],
    defaultValue: "",
  },
  {
    label: "Country of Birth",
    fieldKey: "countryOfBirth",
    type: "select",
    options: [{ value: "", label: "All" }, ...EU_COUNTRIES],
    defaultValue: "",
  },
];

const getDefaultValues = (): SearchInputData => {
  return FORM_FIELDS_CONFIG.reduce(
    (acc, field) => ({
      ...acc,
      [field.fieldKey]: field.defaultValue ?? "",
    }),
    {} as SearchInputData
  );
};

export default function GVariantsSearchBar({
  onSearchAction,
  loading,
}: GVariantsSearchBarProps) {
  const [searchFilterInput, setSearchFilterInput] =
    useState<SearchInputData>(getDefaultValues());
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
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-4 items-end">
        {FORM_FIELDS_CONFIG.map(
          ({
            label,
            fieldKey: key,
            type = "text",
            options,
            tooltip,
            placeholder,
          }: FormFieldConfig) => (
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

        <div className="flex flex-col justify-end">
          <Button
            disabled={loading}
            icon={faSearch}
            onClick={search}
            text="Search"
            type="primary"
            className="w-full"
          />
        </div>
      </div>

      <div className="text-md flex items-end gap-2 mt-2">
        <span className="text-black text-md">Variant Example: </span>
        <Button
          className="text-info hover:underline p-0 m-0"
          text="3-45864731-T-C"
          onClick={() => updateData("variant", "3-45864731-T-C")}
        />
      </div>

      {errorMessage && (
        <p className="text-red-500 text-md mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
