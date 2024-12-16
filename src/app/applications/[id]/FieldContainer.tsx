// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FormFieldType } from "@/app/api/access-management/additional-types";
import {
  RetrievedApplicationFormField,
  ValidationWarning,
} from "@/app/api/access-management/open-api/schemas";
import { getTranslation } from "@/utils/getTranslation";
import DateFormField from "./DateFormField";
import EmailFormField from "./EmailFormField";
import FileUploadFormField from "./FileUploadFormField";
import HeaderFormField from "./HeaderFormField";
import InputFormField from "./InputFormField";
import LabelFormField from "./LabelFormField";
import MultiSelectFormField from "./MultiSelectFormField";
import OptionFormField from "./OptionFormField";
import PhoneFormField from "./PhoneFormField";
import TableFormField from "./TableFormField";
import TextAreaFormField from "./TextAreaFormField";

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
      case FormFieldType.ATTACHMENT:
        return (
          <FileUploadFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.LABEL:
        return <LabelFormField field={field} />;
      case FormFieldType.HEADER:
        return <HeaderFormField field={field} />;
      case FormFieldType.TEXT:
        return (
          <InputFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.TEXT_AREA:
        return (
          <TextAreaFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.OPTION:
        return (
          <OptionFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.PHONE:
        return (
          <PhoneFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.DATE:
        return (
          <DateFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.EMAIL:
        return (
          <EmailFormField
            field={field}
            formId={formId}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.MULTISELECT:
        return (
          <MultiSelectFormField
            formId={formId}
            field={field}
            title={fieldTitle}
            editable={editable}
            validationWarning={label}
          />
        );
      case FormFieldType.TABLE:
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
