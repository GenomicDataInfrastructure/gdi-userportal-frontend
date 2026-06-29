// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/Button";
import { COUNTRY_OPTIONS } from "@/app/api/discovery/additional-types";
import contentConfig from "@/config/contentConfig";
import { faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Tooltip from "../datasets/[id]/Tooltip";
import { useTranslations } from "next-intl";

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
  datasetTypeOptions: string[];
};

export type SearchInputData = {
  variant: string;
  refGenome: string;
  sex: string;
  countryOfBirth: string;
  datasetType: string;
};

const ALL_VARIANT_SEARCH_ENABLED = contentConfig.enableAllVariantSearch;

export default function GVariantsSearchBar({
  onSearchAction,
  loading,
  datasetTypeOptions,
}: GVariantsSearchBarProps) {
  const t = useTranslations("alleleFrequency");

  const REFERENCE_OPTIONS = [
    { value: "", label: t("selectReferenceGenome") },
    { value: "GRCh37", label: "GRCh37" },
    { value: "GRCh38", label: "GRCh38" },
  ];

  const SEX_OPTIONS = [
    { value: "", label: t("selectSex") },
    { value: "All", label: "All" },
    { value: "M", label: t("male") },
    { value: "F", label: t("female") },
  ];

  const DISABLED_SEARCH_TOOLTIP = t("disabledSearchTooltip");

  const [searchFilterInput, setSearchFilterInput] = useState<SearchInputData>({
    variant: "",
    refGenome: "",
    sex: "",
    countryOfBirth: "",
    datasetType: "All",
  });
  const [errorMessage, setErrorMessage] = useState("");

  function isAllVariantKeyword(variant: string) {
    return ALL_VARIANT_SEARCH_ENABLED && variant.trim().toLowerCase() === "all";
  }

  function isVariantValid(variant: string) {
    const normalizedVariant = variant.trim().toLowerCase();
    if (normalizedVariant === "all") {
      return ALL_VARIANT_SEARCH_ENABLED;
    }

    if (isAllVariantKeyword(variant)) {
      return true;
    }

    const fullVariantPattern =
      /^(?:[1-9]|1[0-9]|2[0-2]|X|Y)-[1-9]\d*-[ACGT]+-[ACGT]+$/i;
    const positionOnlyPattern = /^(?:[1-9]|1[0-9]|2[0-2]|X|Y)-[1-9]\d*$/i;

    return (
      fullVariantPattern.test(normalizedVariant) ||
      positionOnlyPattern.test(normalizedVariant)
    );
  }

  const updateData = (field: keyof SearchInputData, value: string) => {
    setSearchFilterInput((prev) => {
      const updatedState = { ...prev, [field]: value };
      const normalizedVariant = updatedState.variant.trim();
      const variantIsAllKeyword = isAllVariantKeyword(normalizedVariant);

      if (field === "refGenome" && !value) {
        updatedState.variant = "";
        updatedState.sex = "";
        updatedState.countryOfBirth = "";
        updatedState.datasetType = "All";
      }

      if (field === "variant" && (!normalizedVariant || variantIsAllKeyword)) {
        updatedState.sex = "";
        updatedState.countryOfBirth = "";
      }

      setErrorMessage(() =>
        !normalizedVariant
          ? ""
          : normalizedVariant.toLowerCase() === "all" &&
              !ALL_VARIANT_SEARCH_ENABLED
            ? t("incorrectVariant")
            : isVariantValid(normalizedVariant)
              ? ""
              : t("incorrectVariant")
      );
      return updatedState;
    });
  };

  const normalizedVariant = searchFilterInput.variant.trim();
  const variantEntered = normalizedVariant.length > 0;
  const variantIsAllKeyword = isAllVariantKeyword(normalizedVariant);
  const variantIsValid = variantEntered && isVariantValid(normalizedVariant);
  const canShowVariant = searchFilterInput.refGenome !== "";
  const canShowSex = canShowVariant && variantEntered && !variantIsAllKeyword;
  const canShowCountry =
    canShowVariant && variantEntered && !variantIsAllKeyword;
  const isSearchComplete = searchFilterInput.refGenome !== "" && variantIsValid;
  const isSearchDisabled = loading || !isSearchComplete;

  const search = () => {
    if (errorMessage || !isSearchComplete) {
      return;
    }

    onSearchAction(searchFilterInput);
  };
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">
        {t("searchForYourVariant")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        <FormField
          fieldKey="refGenome"
          label={t("refGenome")}
          type="select"
          value={searchFilterInput.refGenome}
          onChange={(value) => updateData("refGenome", value)}
          options={REFERENCE_OPTIONS}
        />

        {canShowVariant && (
          <FormField
            fieldKey="variant"
            label={t("variant")}
            type="text"
            value={searchFilterInput.variant}
            onChange={(value) => updateData("variant", value)}
            placeholder={t("variantPlaceholder")}
            tooltip={t("variantTooltip")}
          />
        )}

        {canShowSex && (
          <FormField
            fieldKey="sex"
            label={t("sex")}
            type="select"
            value={searchFilterInput.sex}
            onChange={(value) => updateData("sex", value)}
            options={SEX_OPTIONS}
          />
        )}

        {canShowCountry && (
          <FormField
            fieldKey="countryOfBirth"
            label={t("countryOfBirth")}
            type="select"
            value={searchFilterInput.countryOfBirth}
            onChange={(value) => updateData("countryOfBirth", value)}
            options={[
              { value: "", label: t("selectCountry") },
              { value: "All", label: "All" },
              ...COUNTRY_OPTIONS,
            ]}
          />
        )}

        {canShowVariant && (
          <FormField
            fieldKey="datasetType"
            label={t("datasetType")}
            type="select"
            value={searchFilterInput.datasetType}
            onChange={(value) => updateData("datasetType", value)}
            options={[
              { value: "All", label: "All" },
              ...datasetTypeOptions.map((datasetType) => ({
                value: datasetType,
                label: datasetType,
              })),
            ]}
          />
        )}

        <div className="flex flex-col col-span-1">
          <Button
            disabled={isSearchDisabled}
            icon={faSearch}
            onClick={search}
            text={t("search")}
            type="primary"
            className="text-center"
            props={
              isSearchDisabled ? { title: DISABLED_SEARCH_TOOLTIP } : undefined
            }
          />
        </div>
      </div>

      {canShowVariant && (
        <div className="text-md flex items-end gap-2 mt-2">
          <span className="text-black text-md">{t("variantExample")}</span>
          <Button
            className="text-info hover:underline p-0 m-0"
            text="21-9411449-G-T"
            onClick={() => updateData("variant", "21-9411449-G-T")}
          />
        </div>
      )}

      {errorMessage && (
        <p className="text-red-500 text-md mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
