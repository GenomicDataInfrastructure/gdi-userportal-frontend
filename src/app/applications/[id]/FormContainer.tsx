// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Form } from "@/types/application.types";
import FieldContainer from "./FieldContainer";
import { EditableProvider } from "./EditableContext";
import { useEffect, useState, useCallback, useRef } from "react";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";

type FormContainerProps = {
  form: Form;
  isEditable: boolean;
};

function FormContainer({ form, isEditable }: FormContainerProps) {
  const formTitle =
    form.externalTitle.find((label) => label.language === "en")?.name ||
    form.externalTitle?.[0]?.name;

  const { saveFormAndDuos } = useApplicationDetails();
  const [formFields, setFormFields] = useState(form.fields);

  const previousFormFieldsRef = useRef(form.fields);
  const timeoutIdRef = useRef<number | null>(null);

  const checkAllFieldsCompleted = useCallback(() => {
    return formFields.every(
      (field) => field.value !== null && field.value !== ""
    );
  }, [formFields]);

  useEffect(() => {
    const previousFormFields = previousFormFieldsRef.current;
    if (JSON.stringify(previousFormFields) !== JSON.stringify(formFields)) {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = window.setTimeout(() => {
        if (checkAllFieldsCompleted()) {
          saveFormAndDuos([form]);
        }
      }, 2000);
    }

    previousFormFieldsRef.current = formFields;
  }, [formFields, checkAllFieldsCompleted, saveFormAndDuos, form]);

  const handleFieldChange = (fieldId: number, newValue: string) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, value: newValue } : field
      )
    );
  };

  return (
    <EditableProvider isEditable={isEditable}>
      <div className="mt-8">
        <h3 className="mb-4 text-2xl text-primary">{formTitle}</h3>
        <ul className="space-y-4">
          {formFields.map(
            (field) =>
              field && (
                <li key={field.id}>
                  <FieldContainer
                    formId={form.id}
                    field={field}
                    onFieldChange={handleFieldChange}
                  />
                </li>
              )
          )}
        </ul>
      </div>
    </EditableProvider>
  );
}

export default FormContainer;
