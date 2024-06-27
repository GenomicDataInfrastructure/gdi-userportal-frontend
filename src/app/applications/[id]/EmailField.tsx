// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import { FormField } from "@/types/application.types";
import GenericInputField from "./GenericInputField";

type EmailFieldProps = {
  field: FormField;
  formId: number;
  title: string;
};

function EmailField({ field, formId, title }: EmailFieldProps) {
  return (
    <GenericInputField
      field={field}
      formId={formId}
      type="email"
      placeholder="Enter your email address"
      title={title}
    />
  );
}

export default EmailField;
