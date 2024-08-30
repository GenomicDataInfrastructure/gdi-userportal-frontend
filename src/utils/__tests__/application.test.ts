// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  FieldType,
  Form,
  FormField,
  RetrievedApplication,
  State,
} from "@/types/application.types";
import {
  addAttachmentIdToFieldValue,
  deleteAttachmentIdFromFieldValue,
  formatApplicationProp,
  updateFormWithNewAttachment,
  updateFormsInputValues,
  groupWarningsPerFormId,
  isApplicationEditable,
} from "../application";
import { ValidationWarning } from "@/types/api.types";

describe("Update application correctly when adding an attachment", () => {
  it("should concatenate the current field value with the attachment id when field value already contains values", () => {
    const forms: Form[] = getForms();
    const formId = 1;
    const fieldId = "2";
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
    const fieldId = "1";
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
    const fieldId = "2";
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
    const fieldId = "2";
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
    const fieldId = "2";
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
    const fieldId = "2";
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

describe("Update application with TABLE field", () => {
  it("should correctly update the value of a TABLE field", () => {
    const forms: Form[] = getFormsWithTableField();
    const formId = 3;
    const fieldId = "3";
    const newValue = JSON.stringify([
      [{ column: "A", value: "New Value A1" }],
      [{ column: "B", value: "New Value B1" }],
    ]);

    const updatedForms = updateFormsInputValues(
      forms,
      formId,
      fieldId,
      newValue
    );

    expect(updatedForms[0].fields[2].value).toEqual(newValue);
    expect(updatedForms[0].fields[2].tableValues).toEqual(JSON.parse(newValue));
  });
});

describe("isPresent function behavior", () => {
  it("should not remove attachment ID when it is not present", () => {
    const value = "1,2,3";
    const attachmentId = 4;

    const result = deleteAttachmentIdFromFieldValue(value, attachmentId);

    expect(result).toEqual(value);
  });

  it("should remove attachment ID when it is present", () => {
    const value = "1,2,3";
    const attachmentId = 2;

    const result = deleteAttachmentIdFromFieldValue(value, attachmentId);

    expect(result).toEqual("1,3");
  });
});

describe("Check if application state is correctly formatted", () => {
  it("should format state correctly", () => {
    const state = State.APPROVED;

    const formattedState = formatApplicationProp(state);

    expect(formattedState).toEqual("approved");
  });
});

describe("groupWarningsPerFormId", () => {
  it("should return an empty map when given an empty array", () => {
    const warnings: ValidationWarning[] = [];
    const result = groupWarningsPerFormId(warnings);
    expect(result.size).toBe(0);
  });

  it("should group warnings by formId", () => {
    const warnings: ValidationWarning[] = [
      { formId: 1, key: "Warning 1", fieldId: "1" },
      { formId: 2, key: "Warning 2", fieldId: "1" },
      { formId: 1, key: "Warning 3", fieldId: "1" },
    ];

    const result = groupWarningsPerFormId(warnings);

    expect(result.size).toBe(2);
    expect(result.get(1)).toEqual([
      { formId: 1, key: "Warning 1", fieldId: "1" },
      { formId: 1, key: "Warning 3", fieldId: "1" },
    ]);
    expect(result.get(2)).toEqual([
      { formId: 2, key: "Warning 2", fieldId: "1" },
    ]);
  });

  it("should handle warnings with the same formId correctly", () => {
    const warnings: ValidationWarning[] = [
      { formId: 3, key: "Warning 1", fieldId: "1" },
      { formId: 3, key: "Warning 2", fieldId: "1" },
      { formId: 3, key: "Warning 3", fieldId: "1" },
    ];

    const result = groupWarningsPerFormId(warnings);

    expect(result.size).toBe(1);
    expect(result.get(3)).toEqual([
      { formId: 3, key: "Warning 1", fieldId: "1" },
      { formId: 3, key: "Warning 2", fieldId: "1" },
      { formId: 3, key: "Warning 3", fieldId: "1" },
    ]);
  });

  it("should handle mixed formIds and empty arrays correctly", () => {
    const warnings: ValidationWarning[] = [
      { formId: 1, key: "Warning 1", fieldId: "1" },
      { formId: 2, key: "Warning 2", fieldId: "1" },
      { formId: 2, key: "Warning 3", fieldId: "1" },
      { formId: 3, key: "Warning 4", fieldId: "1" },
      { formId: 1, key: "Warning 5", fieldId: "1" },
      { formId: 4, key: "Warning 6", fieldId: "1" },
    ];

    const result = groupWarningsPerFormId(warnings);

    expect(result.size).toBe(4);
    expect(result.get(1)).toEqual([
      { formId: 1, key: "Warning 1", fieldId: "1" },
      { formId: 1, key: "Warning 5", fieldId: "1" },
    ]);
    expect(result.get(2)).toEqual([
      { formId: 2, key: "Warning 2", fieldId: "1" },
      { formId: 2, key: "Warning 3", fieldId: "1" },
    ]);
    expect(result.get(3)).toEqual([
      { formId: 3, key: "Warning 4", fieldId: "1" },
    ]);
    expect(result.get(4)).toEqual([
      { formId: 4, key: "Warning 6", fieldId: "1" },
    ]);
  });
});

describe("isApplicationEditable", () => {
  it("should return true when the application state is DRAFT", () => {
    const application = { state: State.DRAFT } as RetrievedApplication;
    const result = isApplicationEditable(application);
    expect(result).toBe(true);
  });

  it("should return true when the application state is RETURNED", () => {
    const application = { state: State.RETURNED } as RetrievedApplication;
    const result = isApplicationEditable(application);
    expect(result).toBe(true);
  });

  it("should return false when the application state is SUBMITTED", () => {
    const application = { state: State.SUBMITTED } as RetrievedApplication;
    const result = isApplicationEditable(application);
    expect(result).toBe(false);
  });

  it("should return false when the application state is APPROVED", () => {
    const application = { state: State.APPROVED } as RetrievedApplication;
    const result = isApplicationEditable(application);
    expect(result).toBe(false);
  });

  it("should return false for any state other than DRAFT or RETURNED", () => {
    // Assuming more states exist, or handling any future states
    const application = {
      state: "OTHER_STATE" as State,
    } as RetrievedApplication;
    const result = isApplicationEditable(application);
    expect(result).toBe(false);
  });
});

function getForms() {
  const form1 = createForm(1, [
    createField("1", "", FieldType.ATTACHMENT),
    createField("2", "4,5", FieldType.ATTACHMENT),
    createField("3", "", FieldType.TEXT),
  ]);
  const form2 = createForm(2, [
    createField("1", "22", FieldType.ATTACHMENT),
    createField("2", "8,2", FieldType.ATTACHMENT),
    createField("3", "", FieldType.TEXT_AREA),
  ]);
  return [form1, form2];
}

function getFormsWithTableField() {
  const form3 = createForm(3, [
    createField("1", "22", FieldType.ATTACHMENT),
    createField("2", "8,2", FieldType.ATTACHMENT),
    createField(
      "3",
      JSON.stringify([
        [{ column: "A", value: "Value A1" }],
        [{ column: "B", value: "Value B1" }],
      ]),
      FieldType.TABLE
    ),
  ]);
  return [form3];
}

function createForm(id: number, fields: FormField[]) {
  return {
    id,
    internalName: `Form ${id}`,
    externalTitle: [],
    fields,
  };
}

function createField(id: string, value: string, type: FieldType) {
  return {
    id,
    value,
    optional: false,
    private: false,
    visible: false,
    title: [],
    options: [],
    tableColumns: [],
    tableValues: [],
    type,
  };
}
