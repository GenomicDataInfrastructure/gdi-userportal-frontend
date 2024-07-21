// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FormField } from "@/types/application.types";
import GenericInputField from "./GenericInputField";

type InputFormFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  isEditable: boolean;
  onFieldChange: (fieldId: number, newValue: string) => void;
};

function InputFormField({
  formId,
  field,
  title,
  isEditable,
  onFieldChange,
}: InputFormFieldProps) {
  return (
    <GenericInputField
      field={field}
      formId={formId}
      type="text"
      placeholder={title}
      title={title}
      isEditable={isEditable}
      onFieldChange={onFieldChange}
    />
  );
}

export default InputFormField;
