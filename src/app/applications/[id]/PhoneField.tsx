// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from "react";
import PhoneInput from "@/components/PhoneInput";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField } from "@/types/application.types";

type PhoneFieldProps = {
  field: FormField;
  formId: number;
  title: string;
};

function PhoneField({ formId, field, title }: PhoneFieldProps) {
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

  const handlePhoneChange = (value: string) => {
    setInputValue(value);
    field.value = value;
  };

  const handlePhoneBlur = () => {
    if (inputValue) {
      const formattedValue = formatPhoneNumber(inputValue);
      updateInputFields(formId, field.id, formattedValue);
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    if (!phone.startsWith("+")) {
      phone = `+${phone}`;
    }
    return phone.replace(/\s+/g, "");
  };

  return (
    <div className="rounded border p-4">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">{`${title} ${field.optional ? "(Optional)" : ""
            }`}</h3>
        </div>
        <div className="mt-4 flex w-full items-center">
          <PhoneInput
            value={inputValue}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default PhoneField;
