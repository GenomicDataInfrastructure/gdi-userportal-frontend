// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  Label,
  RetrievedApplicationFormField,
} from "@/app/api/access-management/open-api/schemas";

type LabelFormFieldProps = {
  field: RetrievedApplicationFormField;
};

function LabelFormField({ field }: LabelFormFieldProps) {
  return (
    <div className="flex flex-col py-2 ">
      <div className="flex flex-col justify-between">
        <h3 className="text-lg sm:text-xl">
          {field.title!.find((label: Label) => label.language === "en")?.name ||
            field.title![0].name}
        </h3>
      </div>
    </div>
  );
}

export default LabelFormField;
