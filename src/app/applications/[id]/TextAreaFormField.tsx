// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField } from "@/types/application.types";
import { useEffect, useState } from "react";

type TextAreaFormFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function TextAreaFormField({
  formId,
  field,
  title,
  editable,
  validationWarning,
}: TextAreaFormFieldProps) {
  const { updateInputFields } = useApplicationDetails();
  const [inputValue, setInputValue] = useState(field.value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== field.value) {
        updateInputFields(formId, field.id, inputValue);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, formId, field, updateInputFields]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const isDisabled = !editable;

  return (
    <div className="flex flex-col rounded border p-4">
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
          className={`mt-4 w-full rounded-md border-2 border-primary px-4 py-[9px] text-md ${
            isDisabled
              ? "border-slate-200 cursor-not-allowed opacity-50 bg-slate-50"
              : "border-primary focus:outline-none focus:ring-primary"
          }`}
          onChange={handleInputChange}
          disabled={isDisabled}
        />
      </div>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default TextAreaFormField;
