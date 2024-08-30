// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  FieldType,
  Form,
  RetrievedApplication,
  State,
  TableValue,
} from "@/types/application.types";
import { ValidationWarning } from "@/types/api.types";

function formatApplicationProp(prop: string) {
  return prop.split("/").pop();
}

function isApplicationEditable(application: RetrievedApplication) {
  return (
    application.state === State.DRAFT || application.state === State.RETURNED
  );
}

function groupWarningsPerFormId(warnings: ValidationWarning[]) {
  const map = new Map<number, ValidationWarning[]>();
  warnings.forEach((it) => {
    const validations = map.get(it.formId) || [];
    validations.push(it);
    map.set(it.formId, validations);
  });
  return map;
}

function updateFormWithNewAttachment(
  forms: Form[],
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
  forms: Form[],
  formId: number,
  fieldId: string,
  newValue: string
): Form[] {
  return forms.map((form) =>
    form.id === formId ? updateFormInputValues(form, fieldId, newValue) : form
  );
}

function updateFormInputValues(
  form: Form,
  fieldId: string,
  newValue: string
): Form {
  return {
    ...form,
    fields: form.fields.map((field) => {
      if (field.id === fieldId) {
        if (field.type === FieldType.TABLE) {
          return {
            ...field,
            value: newValue,
            tableValues: JSON.parse(newValue) as TableValue[][],
          };
        }
        return { ...field, value: newValue ?? "" };
      }
      return field;
    }),
  };
}

function updateFormFieldWithNewAttachment(
  form: Form,
  fieldId: string,
  newAttachmentId: number,
  action: (fieldValue: string, attachmentId: number) => string
): Form {
  return {
    ...form,
    fields: form.fields.map((field) =>
      field.id === fieldId
        ? { ...field, value: action(field.value, newAttachmentId)! }
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
  isApplicationEditable,
  updateFormWithNewAttachment,
  updateFormsInputValues,
  groupWarningsPerFormId,
};
