// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField } from "@/types/application.types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  isEditable: boolean;
};

function DateField({ formId, field, title, isEditable }: DateFieldProps) {
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
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [inputValue, formId, field.id, field.value, updateInputFields]);

  const handleDateChange = (date: Date | null) => {
    setInputValue(date);
  };

  return (
    <div className="rounded border p-4">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">{`${title} ${field.optional ? "(Optional)" : ""
            }`}</h3>
        </div>
        <DatePicker
          selected={inputValue}
          onChange={handleDateChange}
          className={`mt-4 h-12 w-full rounded-lg border-2 border-primary px-4 py-[9px] text-base shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary ${!isEditable ? "bg-surface" : ""
            }`}
          placeholderText="dd/mm/yyyy"
          dateFormat="dd/MM/yyyy"
          calendarClassName="rounded-lg shadow-lg p-2"
          dayClassName={() => "p-2 rounded-full hover:bg-blue-200"}
          popperPlacement="bottom-start"
          disabled={!isEditable}
        />
      </div>
    </div>
  );
}

export default DateField;
