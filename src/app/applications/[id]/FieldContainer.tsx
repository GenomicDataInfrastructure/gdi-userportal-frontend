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
import { useEditable } from "./EditableContext";

type FieldContainerProps = {
  formId: number;
  field: FormField;
  onFieldChange: (fieldId: number, newValue: string) => void;
};

function FieldContainer({ formId, field, onFieldChange }: FieldContainerProps) {
  const isEditable = useEditable();
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
            onFieldChange={onFieldChange}
          />
        );
      case FieldType.TEXT:
        return (
          <InputFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
            onFieldChange={onFieldChange}
          />
        );
      case FieldType.TEXT_AREA:
        return (
          <TextAreaFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
            onFieldChange={onFieldChange}
          />
        );
      case FieldType.PHONE:
        return (
          <PhoneField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
            onFieldChange={onFieldChange}
          />
        );
      case FieldType.DATE:
        return (
          <DateField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
            onFieldChange={onFieldChange}
          />
        );
      case FieldType.EMAIL:
        return (
          <EmailField
            field={field}
            formId={formId}
            title={fieldTitle}
            isEditable={isEditable}
            onFieldChange={onFieldChange}
          />
        );
    }
  }

  return <>{getFieldComponent()}</>;
}

export default FieldContainer;
