// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Form } from "@/types/application.types";
import FieldContainer from "./FieldContainer";
import { ValidationWarning } from "@/types/api.types";

type FormContainerProps = {
  form: Form;
  editable: boolean;
  validationWarnings?: ValidationWarning[];
};

function FormContainer({
  form,
  editable,
  validationWarnings,
}: FormContainerProps) {
  const formTitle =
    form.externalTitle.find((label) => label.language === "en")?.name ||
    form.externalTitle?.[0]?.name;

  return (
    <div className="mt-8">
      <ul className="space-y-4 border rounded p-4">
        <h3 className="mb-4 text-2xl text-primary">{formTitle}</h3>
        {form.fields.map(
          (field) =>
            field && (
              <li key={field.id}>
                <FieldContainer
                  formId={form.id}
                  field={field}
                  editable={editable}
                  validationWarning={validationWarnings?.find(
                    (it) => it.fieldId === field.id
                  )}
                />
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default FormContainer;
