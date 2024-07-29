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
  editable: boolean;
};

function DateField({ formId, field, title, editable }: DateFieldProps) {
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

  const isDisabled = !editable;

  return (
    <div className="rounded border p-4">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">{`${title} ${
            field.optional ? "(Optional)" : ""
          }`}</h3>
        </div>
        <DatePicker
          selected={inputValue}
          onChange={handleDateChange}
          className={`mt-4 h-12 w-full rounded-lg border-2 border-primary px-4 py-[9px] text-md text-base shadow-sm ${
            isDisabled
              ? "border-slate-200 bg-background ring-offset-background placeholder:text-muted-foreground flex file:border-0 file:bg-transparent file:font-medium file:text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              : "bg-white focus:outline-none focus:ring-primary"
          }`}
          placeholderText="dd/mm/yyyy"
          dateFormat="dd/MM/yyyy"
          calendarClassName="rounded-lg shadow-lg p-2"
          dayClassName={() => "p-2 rounded-full hover:bg-blue-200"}
          popperPlacement="bottom-start"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}

export default DateField;
