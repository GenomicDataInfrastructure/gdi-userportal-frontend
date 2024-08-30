// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FormField, Label } from "@/types/application.types";

type TextBoxFormFieldProps = {
  field: FormField;
};

function TextBoxFormField({ field }: TextBoxFormFieldProps) {
  return (
    <div className="flex flex-col rounded border p-4 ">
      <div className="flex flex-col justify-between">
        <h3 className="text-lg text-primary sm:text-xl">
          {field.title.find((label: Label) => label.language === "en")?.name ||
            field.title[0].name}
        </h3>
      </div>
    </div>
  );
}

export default TextBoxFormField;