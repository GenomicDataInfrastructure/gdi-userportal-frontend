// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FieldType, FormField } from "@/types/application.types";
import FileUploadFormField from "./FileUploadFormField";
import InputFormField from "./InputFormField";
import TextAreaFormField from "./TextAreaFormField";
import DateFormField from "./DateFormField";
import EmailFormField from "./EmailFormField";
import PhoneFormField from "./PhoneFormField";
import { ValidationWarning } from "@/types/api.types";
import { getTranslation } from "@/utils/getTranslation";
import OptionFormField from "./OptionFormField";
import LabelFormField from "./LabelFormField";
import HeaderFormField from "./HeaderFormField";
import MultiSelectFormField from "./MultiSelectFormField";
import TableFormField from "./TableFormField";

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
          <FileUploadFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.LABEL:
        return <LabelFormField field={field} />;
      case FieldType.HEADER:
        return <HeaderFormField field={field} />;
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
      case FieldType.OPTION:
        return (
          <OptionFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.PHONE:
        return (
          <PhoneFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.DATE:
        return (
          <DateFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.EMAIL:
        return (
          <EmailFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.MULTI_SELECT:
        return (
          <MultiSelectFormField
            formId={formId}
            field={field}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FieldType.TABLE:
        return (
          <TableFormField
            formId={formId}
            field={field}
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
