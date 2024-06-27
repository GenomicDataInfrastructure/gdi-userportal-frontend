// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import { FormField } from "@/types/application.types";
import GenericInputField from "./GenericInputField";

type InputFormFieldProps = {
  field: FormField;
  formId: number;
  title: string;
};

function InputFormField({ formId, field, title }: InputFormFieldProps) {
  return (
    <GenericInputField
      field={field}
      formId={formId}
      type="text"
      placeholder={title}
    />
  );
}

export default InputFormField;
