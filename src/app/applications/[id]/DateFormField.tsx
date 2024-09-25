// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField } from "@/types/application.types";
import { DatePicker } from "@/components/shadcn/DatePicker";

type DateFormFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function DateFormField({
  formId,
  field,
  title,
  editable,
  validationWarning,
}: DateFormFieldProps) {
  const { updateInputFields } = useApplicationDetails();
  const [inputValue, setInputValue] = useState<Date | null>(
    field.value ? new Date(field.value) : null
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newValue = inputValue?.toISOString() || "";
      if (newValue !== field.value) {
        updateInputFields(formId, field.id, newValue);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, formId, field.id, field.value, updateInputFields]);

  const handleDateChange = (date: Date | null) => {
    setInputValue(date);
  };

  return (
    <div className="flex flex-col py-2">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl">{`${title} ${
            field.optional ? "(Optional)" : ""
          }`}</h3>
        </div>
        <DatePicker
          value={inputValue}
          onChange={handleDateChange}
          disabled={!editable}
          className="mt-4 h-12 w-full"
        />
      </div>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default DateFormField;
