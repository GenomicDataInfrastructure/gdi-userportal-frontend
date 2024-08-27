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
import { ValidationWarning } from "@/types/api.types";
import { getTranslation } from "@/utils/getTranslation";

type FieldContainerProps = {
  formId: number;
  field: FormField;
  editable: boolean;
  validationWarning?: ValidationWarning;
};

function FieldContainer({
  formId,
  field,
  editable,
  validationWarning,
}: FieldContainerProps) {
  const fieldTitle =
    field.title.find((label) => label.language === "en")?.name ||
    field.title[0].name;

  const label = getTranslation(validationWarning?.key);

  function getFieldComponent() {
    switch (field.type) {
      case FieldType.ATTACHMENT:
        return (
          <FileUploadField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.TEXT:
        return (
          <InputFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.TEXT_AREA:
        return (
          <TextAreaFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.PHONE:
        return (
          <PhoneField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.DATE:
        return (
          <DateField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.EMAIL:
        return (
          <EmailField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
    }
  }

  return <>{getFieldComponent()}</>;
}

export default FieldContainer;
