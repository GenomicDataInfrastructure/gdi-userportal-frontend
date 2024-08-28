// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField, Label, Option } from "@/types/application.types";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type OptionFormFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function OptionFormField({
  formId,
  field,
  title,
  editable,
  validationWarning,
}: OptionFormFieldProps) {
  const { updateInputFields } = useApplicationDetails();
  const [selectedOption, setSelectedOption] = useState(field.value || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedOption !== field.value) {
        updateInputFields(formId, field.id, selectedOption);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedOption, formId, field, updateInputFields]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const isDisabled = !editable;

  return (
    <div className="flex flex-col rounded border p-4">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">
            {title} {field.optional ? "(Optional)" : ""}
          </h3>
        </div>
        <div className="relative">
          <select
            value={selectedOption}
            onChange={handleOptionChange}
            disabled={isDisabled}
            className={`w-full mt-4 rounded-md border-2 px-4 py-[9px] text-md pr-10 ${
              isDisabled
                ? "border-slate-200 cursor-not-allowed opacity-50 bg-slate-50"
                : "border-primary focus:outline-none focus:ring-primary cursor-pointer"
            } appearance-none`}
          >
            <option value="" disabled={!field.options?.length}>
              Select an option
            </option>
            {field.options && field.options.length > 0 ? (
              field.options.map((option: Option) => (
                <option key={option.key} value={option.key}>
                  {option.label.find((label: Label) => label.language === "en")
                    ?.name || option.label[0].name}
                </option>
              ))
            ) : (
              <option disabled>No options available</option>
            )}
          </select>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`absolute right-3 top-1/2 transform -translate-y-1/5 ${
              isDisabled ? "text-slate-200" : "text-black"
            }`}
          />
        </div>
      </div>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default OptionFormField;
