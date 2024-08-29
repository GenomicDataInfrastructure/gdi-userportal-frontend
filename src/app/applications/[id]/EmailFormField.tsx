// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FormField } from "@/types/application.types";
import GenericInputFormField from "./GenericInputFormField";

type EmailFormFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function EmailFormField({
  field,
  formId,
  title,
  editable,
  validationWarning,
}: EmailFormFieldProps) {
  return (
    <GenericInputFormField
      field={field}
      formId={formId}
      type="email"
      placeholder="Enter your email address"
      title={title}
      editable={editable}
      validationWarning={validationWarning}
    />
  );
}

export default EmailFormField;
