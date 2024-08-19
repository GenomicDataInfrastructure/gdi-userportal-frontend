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
  editable: boolean;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  validationWarning?: string;
};

function GenericInputField({
  field,
  formId,
  type,
  placeholder,
  title,
  editable,
  onChange,
  children,
  validationWarning,
}: GenericInputFieldProps) {
  const { isLoading, updateInputFields } = useApplicationDetails();
  const [inputValue, setInputValue] = useState(field.value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== field.value) {
        updateInputFields(formId, field.id, inputValue);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, formId, field, updateInputFields]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const isDisabled = !editable || isLoading;

  return (
    <div className="flex flex-col rounded border p-4">
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
            className={`h-12 w-full rounded-lg border-2 border-primary px-4 text-md py-[9px] ${
              isDisabled
                ? "border-slate-200 bg-background ring-offset-background placeholder:text-muted-foreground flex file:border-0 file:bg-transparent file:font-medium file:text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                : "bg-white border-primary"
            }`}
            placeholder={placeholder}
            disabled={!editable || isLoading}
          />
        </div>
      </div>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default GenericInputField;
