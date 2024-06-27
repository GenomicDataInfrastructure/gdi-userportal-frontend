// SPDX-License-Identifier: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/shadcn/input";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField } from "@/types/application.types";

type EmailFieldProps = {
  readonly field: FormField;
  readonly formId: number;
  readonly title: string;
};

function EmailField({ field, formId, title }: EmailFieldProps) {
  const { isLoading, updateInputFields } = useApplicationDetails();
  const [inputValue, setInputValue] = useState(field.value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== field.value) {
        updateInputFields(formId, field.id, inputValue);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [inputValue, formId, field, updateInputFields]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="rounded border p-4">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">{`${title} ${
            field.optional ? "(Optional)" : ""
          }`}</h3>
        </div>
        <Input
          type="email"
          id="email"
          name="email"
          value={inputValue}
          onChange={handleInputChange}
          className="mt-4 w-full rounded-md border-2 border-primary p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your email address"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

export default EmailField;
