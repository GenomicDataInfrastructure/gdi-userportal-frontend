// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FormField, Label } from "@/types/application.types";

type TextBoxFormFieldProps = {
  field: FormField;
  title: string;
};

function TextBoxFormField({ field, title }: TextBoxFormFieldProps) {
  return (
    <div className="flex flex-col rounded border p-4 ">
      <div className="flex flex-col justify-between">
        <h3 className="text-lg text-primary sm:text-xl">{title}</h3>
        <p className="mt-2 text-md">
          {field.title.find((label: Label) => label.language === "en")?.name ||
            field.title[0].name}
        </p>
      </div>
    </div>
  );
}

export default TextBoxFormField;
