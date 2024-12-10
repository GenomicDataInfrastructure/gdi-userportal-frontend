// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import FieldContainer from "./FieldContainer";
import {
  RetrievedApplicationForm,
  ValidationWarning,
} from "@/app/api/access-management/open-api/schemas";

type FormContainerProps = {
  form: RetrievedApplicationForm;
  editable: boolean;
  validationWarnings?: ValidationWarning[];
};

function FormContainer({
  form,
  editable,
  validationWarnings,
}: Readonly<FormContainerProps>) {
  const formTitle =
    form.externalTitle?.find((label) => label.language === "en")?.name ||
    form.externalTitle?.[0]?.name;

  return (
    <ul className="space-y-4 border rounded-2xl p-5">
      <h3 className="mb-4 text-2xl">{formTitle}</h3>
      {form.fields!.map(
        (field) =>
          !!field?.visible && (
            <li key={field.id}>
              <FieldContainer
                formId={form.id!}
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
