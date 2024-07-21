// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { FormField } from "@/types/application.types";
import classnames from "classnames";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";

type TextAreaFormFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  isEditable: boolean;
  onFieldChange: (fieldId: number, newValue: string) => void;
};

function TextAreaFormField({
  formId,
  field,
  title,
  isEditable,
  onFieldChange,
}: TextAreaFormFieldProps) {
  const { updateInputFields } = useApplicationDetails();
  const [inputValue, setInputValue] = useState(field.value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== field.value) {
        updateInputFields(formId, field.id, inputValue);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [inputValue, formId, field, updateInputFields]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onFieldChange(field.id, newValue);
  };

  return (
    <div className="rounded border p-4">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">{`${title} ${
            field.optional ? "(Optional)" : ""
          }`}</h3>
        </div>
        <textarea
          placeholder={title}
          rows={5}
          value={inputValue}
          className={classnames(
            "mt-4 w-full rounded-lg border-2 border-primary px-4 py-[9px] shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
            isEditable
              ? ""
              : "pointer-events-none bg-surface border-none text-gray-500"
          )}
          onChange={handleInputChange}
          disabled={!isEditable}
        />
      </div>
    </div>
  );
}

export default TextAreaFormField;
