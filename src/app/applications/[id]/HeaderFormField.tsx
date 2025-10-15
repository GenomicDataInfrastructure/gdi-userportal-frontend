// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  Label,
  RetrievedApplicationFormField,
} from "@/app/api/access-management/open-api/schemas";

type HeaderFormFieldProps = {
  field: RetrievedApplicationFormField;
};

function HeaderFormField({ field }: HeaderFormFieldProps) {
  return (
    <div className="flex flex-col py-2 ">
      <div className="flex flex-col justify-between">
        <h3 className="text-[27px]">
          {field.title!.find((label: Label) => label.language === "en")?.name ||
            field.title![0].name}
        </h3>
      </div>
    </div>
  );
}

export default HeaderFormField;
