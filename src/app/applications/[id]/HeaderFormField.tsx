// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FormField, Label } from "@/types/application.types";

type HeaderFormFieldProps = {
  field: FormField;
};

function HeaderFormField({ field }: HeaderFormFieldProps) {
  return (
    <div className="flex flex-col py-2 ">
      <div className="flex flex-col justify-between">
        <h3 className="text-[27px] text-primary">
          {field.title.find((label: Label) => label.language === "en")?.name ||
            field.title[0].name}
        </h3>
      </div>
    </div>
  );
}

export default HeaderFormField;
