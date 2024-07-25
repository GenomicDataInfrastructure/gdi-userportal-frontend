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
  editable: boolean;
};

function InputFormField({
  formId,
  field,
  title,
  editable,
}: InputFormFieldProps) {
  return (
    <GenericInputField
      field={field}
      formId={formId}
      type="text"
      placeholder={title}
      title={title}
      editable={editable}
    />
  );
}

export default InputFormField;
