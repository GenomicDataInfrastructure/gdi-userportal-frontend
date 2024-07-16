// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { FieldType, Form, FormField, State } from "@/types/application.types";
import {
  addAttachmentIdToFieldValue,
  deleteAttachmentIdFromFieldValue,
  formatApplicationProp,
  updateFormWithNewAttachment,
  updateFormsInputValues,
} from "../application";

describe("Update application correctly when adding an attachment", () => {
  it("should concatenate the current field value with the attachment id when field value already contains values", () => {
    const forms: Form[] = getForms();
    const formId = 1;
    const fieldId = 2;
    const newAttachmentId = 193;

    const updatedForms = updateFormWithNewAttachment(
      forms,
      formId,
      fieldId,
      newAttachmentId,
      addAttachmentIdToFieldValue
    );

    expect(updatedForms[0].fields[1].value).toEqual("4,5,193");
  });

  it("should set the field value as attachment id when field value is empty string", () => {
    const forms: Form[] = getForms();
    const formId = 1;
    const fieldId = 1;
    const newAttachmentId = 11;

    const updatedForms = updateFormWithNewAttachment(
      forms,
      formId,
      fieldId,
      newAttachmentId,
      addAttachmentIdToFieldValue
    );

    expect(updatedForms[0].fields[0].value).toEqual("11");
  });

  it("should not update the field value if the attachment to be added is already present in field value", () => {
    const forms: Form[] = getForms();
    const formId = 1;
    const fieldId = 2;
    const newAttachmentId = 5;

    const updatedForms = updateFormWithNewAttachment(
      forms,
      formId,
      fieldId,
      newAttachmentId,
      addAttachmentIdToFieldValue
    );

    expect(updatedForms[0].fields[1].value).toEqual("4,5");
  });
});

describe("Update application correctly when removing an attachment", () => {
  it("should remove the attachment id from field value when field value already contains values", () => {
    const forms: Form[] = getForms();
    const formId = 2;
    const fieldId = 2;
    const attachmentId = 8;

    const updatedForms = updateFormWithNewAttachment(
      forms,
      formId,
      fieldId,
      attachmentId,
      deleteAttachmentIdFromFieldValue
    );

    expect(updatedForms[1].fields[1].value).toEqual("2");
  });

  it("should set the field value as empty string when field value equals attachment id", () => {
    const forms: Form[] = getForms();
    const formId = 2;
    const fieldId = 2;
    const newValue = "text-area-input";

    const updatedForms = updateFormsInputValues(
      forms,
      formId,
      fieldId,
      newValue
    );

    expect(updatedForms[1].fields[1].value).toEqual("text-area-input");
  });

  it("should not update the field value if the attachment id to be removed is not present in field value", () => {
    const forms: Form[] = getForms();
    const formId = 1;
    const fieldId = 2;
    const newValue = "text-input";

    const updatedForms = updateFormsInputValues(
      forms,
      formId,
      fieldId,
      newValue
    );

    expect(updatedForms[0].fields[1].value).toEqual("text-input");
  });
});

describe("Check if application state is correctly formatted", () => {
  it("should format state correctly", () => {
    const state = State.APPROVED;

    const formattedState = formatApplicationProp(state);

    expect(formattedState).toEqual("approved");
  });
});

function getForms() {
  const form1 = createForm(1, [
    createField(1, "", FieldType.ATTACHMENT),
    createField(2, "4,5", FieldType.ATTACHMENT),
    createField(3, "", FieldType.TEXT),
  ]);
  const form2 = createForm(2, [
    createField(1, "22", FieldType.ATTACHMENT),
    createField(2, "8,2", FieldType.ATTACHMENT),
    createField(3, "", FieldType.TEXT_AREA),
  ]);
  return [form1, form2];
}

function createForm(id: number, fields: FormField[]) {
  return {
    id,
    internalName: `Form ${id}`,
    externalTitle: [],
    fields,
  };
}

function createField(id: number, value: string, type: FieldType) {
  return {
    id,
    value,
    optional: false,
    private: false,
    visible: false,
    title: [],
    type,
  };
}
