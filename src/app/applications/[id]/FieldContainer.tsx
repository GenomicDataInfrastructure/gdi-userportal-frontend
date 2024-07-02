// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FieldType, FormField } from "@/types/application.types";
import { isApplicationEditable } from "@/utils/application";
import FileUploadField from "./FileUploadFormField";
import InputFormField from "./InputFormField";
import TextAreaFormField from "./TextAreaFormField";
import DateField from "./DateField";
import EmailField from "./EmailField";
import PhoneField from "./PhoneField";

type FieldContainerProps = {
  formId: number;
  field: FormField;
};

function FieldContainer({ formId, field }: FieldContainerProps) {
  const { application } = useApplicationDetails();

  const fieldTitle =
    field.title.find((label) => label.language === "en")?.name ||
    field.title[0].name;

  function getFieldComponent() {
    switch (field.type) {
      case FieldType.ATTACHMENT:
        return (
          <FileUploadField field={field} formId={formId} title={fieldTitle} />
        );
      case FieldType.TEXT:
        return (
          <InputFormField field={field} formId={formId} title={fieldTitle} />
        );
      case FieldType.TEXT_AREA:
        return (
          <TextAreaFormField field={field} formId={formId} title={fieldTitle} />
        );
      case FieldType.PHONE:
        return <PhoneField field={field} formId={formId} title={fieldTitle} />;
      case FieldType.DATE:
        return <DateField field={field} formId={formId} title={fieldTitle} />;
      case FieldType.EMAIL:
        return <EmailField field={field} formId={formId} title={fieldTitle} />;
    }
  }

  return <>{isApplicationEditable(application!) && getFieldComponent()}</>;
}

export default FieldContainer;
