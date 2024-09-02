// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from "react";
import { Input } from "@/components/shadcn/input";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField } from "@/types/application.types";

type GenericInputFormFieldProps = {
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

function GenericInputFormField({
  field,
  formId,
  type,
  placeholder,
  title,
  editable,
  onChange,
  children,
  validationWarning,
}: GenericInputFormFieldProps) {
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const isDisabled = !editable;

  return (
    <div className="flex flex-col py-2">
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
            className={`h-12 w-full rounded-md border-2 border-primary px-4 text-md py-[9px] ${
              isDisabled
                ? "border-slate-200 cursor-not-allowed opacity-50 bg-slate-50"
                : "border-primary focus:outline-none focus:ring-primary"
            }`}
            placeholder={placeholder}
            disabled={isDisabled}
          />
        </div>
      </div>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default GenericInputFormField;
