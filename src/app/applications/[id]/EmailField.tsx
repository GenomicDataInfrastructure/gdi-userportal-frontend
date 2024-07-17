// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FormField } from "@/types/application.types";
import GenericInputField from "./GenericInputField";

type EmailFieldProps = {
  field: FormField;
  formId: number;
  title: string;
  isEditable: boolean;
};

function EmailField({ field, formId, title, isEditable }: EmailFieldProps) {
  return (
    <GenericInputField
      field={field}
      formId={formId}
      type="email"
      placeholder="Enter your email address"
      title={title}
      isEditable={isEditable}
    />
  );
}

export default EmailField;
