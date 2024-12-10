// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import GenericInputFormField from "./GenericInputFormField";
import { RetrievedApplicationFormField } from "@/app/api/access-management/open-api/schemas";

type EmailFormFieldProps = {
  field: RetrievedApplicationFormField;
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
