// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import { FormField } from "@/types/application.types";
import GenericInputField from "./GenericInputField";

type PhoneFieldProps = {
  field: FormField;
  formId: number;
  title: string;
};

function PhoneField({ formId, field, title }: PhoneFieldProps) {
  return (
    <GenericInputField
      field={field}
      formId={formId}
      type="tel"
      placeholder="Enter your phone number"
      title={title}
    >
      <select className="mr-2 h-12 rounded-md border-2 border-primary p-2 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="+352">+352</option>
        <option value="+1">+1</option>
        <option value="+44">+44</option>
        <option value="+91">+91</option>
      </select>
    </GenericInputField>
  );
}

export default PhoneField;
