// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { useState, useEffect } from "react";
import {
  FormFieldOption,
  Label,
  RetrievedApplicationFormField,
} from "@/app/api/access-management/open-api/schemas";

type MultiSelectFormFieldProps = {
  field: RetrievedApplicationFormField;
  formId: number;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function MultiSelectFormField({
  formId,
  field,
  title,
  editable,
  validationWarning,
}: MultiSelectFormFieldProps) {
  const { updateInputFields } = useApplicationDetails();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    field.value ? field.value.split(" ") : []
  );

  useEffect(() => {
    const newValue = selectedOptions.join(" ");
    if (newValue !== field.value) {
      updateInputFields(formId, field.id!, newValue);
    }
  }, [selectedOptions, formId, field, updateInputFields]);

  const handleCheckboxChange = (optionKey: string, isChecked: boolean) => {
    setSelectedOptions((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, optionKey];
      } else {
        return prevSelected.filter((key) => key !== optionKey);
      }
    });
  };

  const isDisabled = !editable;

  return (
    <div
      className={`flex flex-col py-2 ${
        isDisabled ? "disabled:opacity-50 border-slate-200" : "bg-white"
      }`}
    >
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl">
            {title} {field.optional ? "(Optional)" : ""}
          </h3>
        </div>
        <div className="flex flex-col mt-4">
          {field.options!.map((option: FormFieldOption) => (
            <div
              key={option.key}
              className={`flex items-center mb-2 ${
                isDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 border rounded-md checked:accent-secondary flex-none cursor-pointer disabled:cursor-not-allowed"
                id={option.key}
                value={option.key}
                checked={selectedOptions.includes(option.key)}
                onChange={(e) =>
                  handleCheckboxChange(option.key, e.target.checked)
                }
                disabled={isDisabled}
              />
              <label
                htmlFor={option.key}
                className={`ml-2 text-md px-1 rounded-md ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-warning hover:text-black cursor-pointer"
                }`}
              >
                {option.label.find((label: Label) => label.language === "en")
                  ?.name || option.label[0].name}
              </label>
            </div>
          ))}
        </div>
      </div>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default MultiSelectFormField;
