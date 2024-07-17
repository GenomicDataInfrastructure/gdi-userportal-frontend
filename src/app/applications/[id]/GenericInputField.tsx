// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from "react";
import { Input } from "@/components/shadcn/input";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField } from "@/types/application.types";

type GenericInputFieldProps = {
  field: FormField;
  formId: number;
  type: string;
  placeholder: string;
  title: string;
  isEditable: boolean;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
};

function GenericInputField({
  field,
  formId,
  type,
  placeholder,
  title,
  isEditable,
  onChange,
  children,
}: GenericInputFieldProps) {
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="rounded border p-4">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">{`${title} ${
            field.optional ? "(Optional)" : ""
          }`}</h3>
        </div>
        <div className="mt-4 flex items-center">
          {children}
          <Input
            type={type}
            id={field.id.toString()}
            name={field.id.toString()}
            value={inputValue}
            onChange={handleInputChange}
            className={`h-12 w-full rounded-lg border-2 border-primary px-4 py-[9px] shadow-sm transition-all duration-200 ease-in-out ${
              !isEditable ? "pointer-events-none" : ""
            }`}
            placeholder={placeholder}
            readOnly={!isEditable}
          />
        </div>
      </div>
    </div>
  );
}

export default GenericInputField;
