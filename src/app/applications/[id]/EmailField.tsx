// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import { FormField } from "@/types/application.types";
import GenericInputField from "./GenericInputField";

type EmailFieldProps = {
  readonly field: FormField;
  readonly formId: number;
  readonly title: string;
};

function EmailField({ field, formId }: EmailFieldProps) {
  return (
    <GenericInputField
      field={field}
      formId={formId}
      type="email"
      placeholder="Enter your email address"
    />
  );
}

export default EmailField;
