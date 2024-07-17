// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FieldType, FormField } from "@/types/application.types";
import FileUploadField from "./FileUploadFormField";
import InputFormField from "./InputFormField";
import TextAreaFormField from "./TextAreaFormField";
import DateField from "./DateField";
import EmailField from "./EmailField";
import PhoneField from "./PhoneField";

type FieldContainerProps = {
  formId: number;
  field: FormField;
  isEditable: boolean;
};

function FieldContainer({ formId, field, isEditable }: FieldContainerProps) {
  const fieldTitle =
    field.title.find((label) => label.language === "en")?.name ||
    field.title[0].name;

  function getFieldComponent() {
    switch (field.type) {
      case FieldType.ATTACHMENT:
        return (
          <FileUploadField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
          />
        );
      case FieldType.TEXT:
        return (
          <InputFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
          />
        );
      case FieldType.TEXT_AREA:
        return (
          <TextAreaFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
          />
        );
      case FieldType.PHONE:
        return (
          <PhoneField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
          />
        );
      case FieldType.DATE:
        return (
          <DateField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
          />
        );
      case FieldType.EMAIL:
        return (
          <EmailField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
          />
        );
    }
  }

  return <>{getFieldComponent()}</>;
}

export default FieldContainer;
