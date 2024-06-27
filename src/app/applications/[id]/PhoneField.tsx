// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React, { useState } from "react";
import { Input } from "@/components/shadcn/input";
import { FormField } from "@/types/application.types";

type PhoneFieldProps = {
  readonly field: FormField;
  readonly formId: number;
  readonly title: string;
};

function PhoneField({ field, formId, title }: PhoneFieldProps) {
  const [prefix, setPrefix] = useState("+352");
  const [inputValue, setInputValue] = useState(field.value);

  const handlePrefixChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrefix(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="rounded border p-4">
      <label htmlFor="phone" className="mb-2 block font-bold text-secondary">
        {title}
      </label>
      <div className="flex items-center">
        <select
          value={prefix}
          onChange={handlePrefixChange}
          className="mr-2 rounded-md border-2 border-primary p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="+352">+352</option>
          <option value="+1">+1</option>
          <option value="+44">+44</option>
          <option value="+91">+91</option>
        </select>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={inputValue}
          onChange={handleInputChange}
          className="block w-full rounded-md border-2 border-primary p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
}

export default PhoneField;
