// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from "react";
import PhoneInput from "@/components/PhoneInput";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { RetrievedApplicationFormField } from "@/app/api/access-management/open-api/schemas";

type PhoneFormFieldProps = {
  field: RetrievedApplicationFormField;
  formId: number;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function PhoneFormField({
  formId,
  field,
  title,
  editable,
  validationWarning,
}: PhoneFormFieldProps) {
  const { updateInputFields } = useApplicationDetails();
  const [inputValue, setInputValue] = useState(field.value!);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== field.value) {
        updateInputFields(formId, field.id!, inputValue);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, formId, field, updateInputFields]);

  const handlePhoneChange = (value: string) => {
    setInputValue(value);
  };

  const handlePhoneBlur = () => {
    if (inputValue) {
      const formattedValue = formatPhoneNumber(inputValue);
      updateInputFields(formId, field.id!, formattedValue);
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    if (!phone.startsWith("+")) {
      phone = `+${phone}`;
    }
    return phone.replace(/\s+/g, "");
  };

  return (
    <div className="flex flex-col py-2">
      <div className="flex flex-col">
        <div>
          <h3 className="text-lg sm:text-xl">{`${title} ${
            field.optional ? "(Optional)" : ""
          }`}</h3>
        </div>
        <div className="mt-4 flex w-full">
          <PhoneInput
            value={inputValue}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            className="flex w-full"
            disabled={!editable}
          />
        </div>
      </div>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default PhoneFormField;
