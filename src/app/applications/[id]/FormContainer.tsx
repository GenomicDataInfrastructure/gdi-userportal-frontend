// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ValidationWarning } from "@/types/api.types";
import { Form } from "@/types/application.types";
import FieldContainer from "./FieldContainer";

type FormContainerProps = {
  form: Form;
  editable: boolean;
  validationWarnings?: ValidationWarning[];
};

function FormContainer({
  form,
  editable,
  validationWarnings,
}: Readonly<FormContainerProps>) {
  const formTitle =
    form.externalTitle.find((label) => label.language === "en")?.name ||
    form.externalTitle?.[0]?.name;

  return (
    <ul className="space-y-4 border rounded-2xl p-5">
      <h3 className="mb-4 text-2xl">{formTitle}</h3>
      {form.fields
        .filter((x) => x.visible)
        .map(
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
  );
}

export default FormContainer;
