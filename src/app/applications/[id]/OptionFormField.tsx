// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField, Label, Option } from "@/types/application.types";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Listbox } from "@headlessui/react";

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

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  const isDisabled = !editable;

  return (
    <div className="flex flex-col rounded border p-4">
      <div className="flex flex-col justify-between">
        <h3 className="text-lg text-primary sm:text-xl">
          {title} {field.optional ? "(Optional)" : ""}
        </h3>
        <div className="relative">
          <Listbox
            value={selectedOption}
            onChange={handleSelectChange}
            disabled={isDisabled}
          >
            <Listbox.Button
              className={`w-full mt-4 rounded-md border-2 px-4 py-[9px] text-md pr-10 text-left ${
                isDisabled
                  ? "border-slate-200 cursor-not-allowed bg-slate-50 opacity-50"
                  : "border-primary focus:outline-none focus:ring-primary cursor-pointer"
              }`}
            >
              {selectedOption
                ? field.options
                    .find((option) => option.key === selectedOption)
                    ?.label.find((label: Label) => label.language === "en")
                    ?.name || "Select an option"
                : "Select an option"}
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`absolute right-3 top-1/2 transform -translate-y-1/5 ${
                  isDisabled ? "text-slate-200" : "text-black"
                }`}
              />
            </Listbox.Button>
            <Listbox.Options className="absolute mt-2 w-full rounded-md bg-white shadow-lg max-h-60 ring-1 ring-black ring-opacity-5">
              {field.options.length > 0 ? (
                field.options.map((option: Option) => (
                  <Listbox.Option
                    key={option.key}
                    value={option.key}
                    className={({ active }) =>
                      `cursor-pointer select-none rounded-md relative py-3 pl-10 pr-4 ${
                        active ? "bg-warning text-black" : ""
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span>
                          {option.label.find(
                            (label: Label) => label.language === "en"
                          )?.name || option.label[0].name}
                        </span>
                        {selected && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
                          />
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              ) : (
                <div className="text-center py-2">No options available</div>
              )}
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default OptionFormField;
