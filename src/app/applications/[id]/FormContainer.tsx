// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Form } from "@/types/application.types";
import FieldContainer from "./FieldContainer";

type FormContainerProps = {
  form: Form;
};

function FormContainer({ form }: FormContainerProps) {
  const formTitle =
    form.externalTitle.find((label) => label.language === "en")?.name ||
    form.externalTitle?.[0]?.name;

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-2xl text-primary">{formTitle}</h3>
      <ul className="space-y-4">
        {form.fields.map(
          (field) =>
            field && (
              <li key={field.id}>
                <FieldContainer formId={form.id} field={field} />
              </li>
            ),
        )}
      </ul>
    </div>
  );
}

export default FormContainer;
