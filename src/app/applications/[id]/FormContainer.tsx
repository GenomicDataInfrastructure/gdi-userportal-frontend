// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Form } from "@/types/application.types";
import FieldContainer from "./FieldContainer";
import { EditableProvider } from "./EditableContext";

type FormContainerProps = {
  form: Form;
  isEditable: boolean;
};

function FormContainer({ form, isEditable }: FormContainerProps) {
  const formTitle =
    form.externalTitle.find((label) => label.language === "en")?.name ||
    form.externalTitle?.[0]?.name;

  return (
    <EditableProvider isEditable={isEditable}>
      <div className="mt-8">
        <h3 className="mb-4 text-2xl text-primary">{formTitle}</h3>
        <ul className="space-y-4">
          {form.fields.map(
            (field) =>
              field && (
                <li key={field.id}>
                  <FieldContainer formId={form.id} field={field} />
                </li>
              )
          )}
        </ul>
      </div>
    </EditableProvider>
  );
}

export default FormContainer;
