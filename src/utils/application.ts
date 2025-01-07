// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  ApplicationState,
  FormFieldType,
} from "@/app/api/access-management/additional-types";
import {
  FormFieldTableValue,
  RetrievedApplication,
  RetrievedApplicationForm,
  ValidationWarning,
} from "@/app/api/access-management/open-api/schemas";

function formatApplicationProp(prop: string) {
  return prop.split("/").pop();
}

function isApplicationEditable(application: RetrievedApplication) {
  return (
    application.state === ApplicationState.DRAFT ||
    application.state === ApplicationState.RETURNED
  );
}

function groupWarningsPerFormId(warnings: ValidationWarning[]) {
  const map = new Map<number, ValidationWarning[]>();
  warnings.forEach((it) => {
    const validations = map.get(it.formId!) || [];
    validations.push(it);
    map.set(it.formId!, validations);
  });
  return map;
}

function updateFormWithNewAttachment(
  forms: RetrievedApplicationForm[],
  formId: number,
  fieldId: string,
  newAttachmentId: number,
  action: (fieldValue: string, attachmentId: number) => string
) {
  return forms.map((form) =>
    form.id === formId
      ? updateFormFieldWithNewAttachment(form, fieldId, newAttachmentId, action)
      : form
  );
}

function updateFormsInputValues(
  forms: RetrievedApplicationForm[],
  formId: number,
  fieldId: string,
  newValue: string
): RetrievedApplicationForm[] {
  return forms.map((form) =>
    form.id === formId ? updateFormInputValues(form, fieldId, newValue) : form
  );
}

function updateFormInputValues(
  form: RetrievedApplicationForm,
  fieldId: string,
  newValue: string
): RetrievedApplicationForm {
  return {
    ...form,
    fields: form.fields!.map((field) => {
      if (field.id === fieldId) {
        if (field.type === FormFieldType.TABLE) {
          return {
            ...field,
            value: newValue,
            tableValues: JSON.parse(newValue) as FormFieldTableValue[][],
          };
        }
        return { ...field, value: newValue ?? "" };
      }
      return field;
    }),
  };
}

function updateFormFieldWithNewAttachment(
  form: RetrievedApplicationForm,
  fieldId: string,
  newAttachmentId: number,
  action: (fieldValue: string, attachmentId: number) => string
): RetrievedApplicationForm {
  return {
    ...form,
    fields: form.fields!.map((field) =>
      field.id === fieldId
        ? { ...field, value: action(field.value!, newAttachmentId) }
        : field
    ),
  };
}

function addAttachmentIdToFieldValue(value: string, newAttachmentId: number) {
  if (isPresent(newAttachmentId, value)) return value;
  return value ? `${value},${newAttachmentId}` : newAttachmentId.toString();
}

function deleteAttachmentIdFromFieldValue(value: string, attachmentId: number) {
  if (!isPresent(attachmentId, value)) return value;

  return value === attachmentId.toString()
    ? ""
    : value
        .split(",")
        .filter((id) => id !== attachmentId.toString())
        .join(",");
}

function isPresent(id: number, set: string) {
  return set.split(",").includes(id.toString());
}

export {
  addAttachmentIdToFieldValue,
  deleteAttachmentIdFromFieldValue,
  formatApplicationProp,
  groupWarningsPerFormId,
  isApplicationEditable,
  updateFormsInputValues,
  updateFormWithNewAttachment,
};
