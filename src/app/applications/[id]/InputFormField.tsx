// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import GenericInputFormField from "./GenericInputFormField";
import { RetrievedApplicationFormField } from "@/app/api/access-management/open-api/schemas";

type InputFormFieldProps = {
  field: RetrievedApplicationFormField;
  formId: number;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function InputFormField({
  formId,
  field,
  title,
  editable,
  validationWarning,
}: InputFormFieldProps) {
  return (
    <GenericInputFormField
      field={field}
      formId={formId}
      type="text"
      placeholder={title}
      title={title}
      editable={editable}
      validationWarning={validationWarning}
    />
  );
}

export default InputFormField;
