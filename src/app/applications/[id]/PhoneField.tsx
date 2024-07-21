// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from "react";
import PhoneInput from "@/components/PhoneInput";
import { FormField } from "@/types/application.types";
import classnames from "classnames";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";

type PhoneFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  isEditable: boolean;
  onFieldChange: (fieldId: number, newValue: string) => void;
};

function PhoneField({
  formId,
  field,
  title,
  isEditable,
  onFieldChange,
}: PhoneFieldProps) {
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
    onFieldChange(field.id, value);
  };

  const handlePhoneBlur = () => {
    if (inputValue) {
      const formattedValue = formatPhoneNumber(inputValue);
      onFieldChange(field.id, formattedValue);
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
      <div className="flex flex-col">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">{`${title} ${
            field.optional ? "(Optional)" : ""
          }`}</h3>
        </div>
        <div
          className={classnames("mt-4 flex w-full", {
            "bg-surface": !isEditable,
          })}
        >
          <PhoneInput
            value={inputValue}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            isEditable={isEditable}
            className={classnames("flex w-full")}
          />
        </div>
      </div>
    </div>
  );
}

export default PhoneField;
