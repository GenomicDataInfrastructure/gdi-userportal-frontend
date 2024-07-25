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
            className={`h-12 w-full rounded-lg border-2 border-primary px-4 py-[9px] shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary ${isDisabled ? "border-info bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex text-sm file:border-0 file:bg-transparent file:font-medium file:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" : "bg-white hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"}`}
            placeholder={placeholder}
            disabled={!editable || isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default GenericInputField;
