// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import FileUploadFormField from "./FileUploadFormField";
import InputFormField from "./InputFormField";
import TextAreaFormField from "./TextAreaFormField";
import DateFormField from "./DateFormField";
import EmailFormField from "./EmailFormField";
import PhoneFormField from "./PhoneFormField";
import { getTranslation } from "@/utils/getTranslation";
import OptionFormField from "./OptionFormField";
import LabelFormField from "./LabelFormField";
import HeaderFormField from "./HeaderFormField";
import MultiSelectFormField from "./MultiSelectFormField";
import TableFormField from "./TableFormField";
import {
  FormFieldType,
  RetrievedApplicationFormField,
  ValidationWarning,
} from "@/app/api/access-management/open-api/schemas";

type FieldContainerProps = {
  formId: number;
  field: RetrievedApplicationFormField;
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
    field.title!.find((label) => label.language === "en")?.name ||
    field.title![0].name;

  const label = getTranslation(validationWarning?.key);

  function getFieldComponent() {
    switch (field.type) {
      case FormFieldType.parse("attachment"):
        return (
          <FileUploadFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.parse("label"):
        return <LabelFormField field={field} />;
      case FormFieldType.parse("header"):
        return <HeaderFormField field={field} />;
      case FormFieldType.parse("text"):
        return (
          <InputFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.parse("texta"):
        return (
          <TextAreaFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.parse("option"):
        return (
          <OptionFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.parse("phone-number"):
        return (
          <PhoneFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.parse("date"):
        return (
          <DateFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.parse("email"):
        return (
          <EmailFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.parse("multiselect"):
        return (
          <MultiSelectFormField
            formId={formId}
            field={field}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.parse("table"):
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
