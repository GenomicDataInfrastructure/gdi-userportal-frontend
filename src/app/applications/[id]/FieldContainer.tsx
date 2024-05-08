// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { FormField } from "@/types/application.types";
import { isApplicationEditable } from "@/utils/application";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileUploaded from "./FileUploaded";

type FieldContainerProps = {
  formId: number;
  field: FormField;
};

function FieldContainer({ formId, field }: FieldContainerProps) {
  const { application, isLoading, addAttachment } = useApplicationDetails();

  function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];
    const formData = new FormData();
    formData.set("file", file);
    addAttachment(formId, field.id, formData);
    e.target.value = "";
  }

  const fieldTitle =
    field.title.find((label) => label.language === "en")?.name ||
    field.title[0].name;

  return (
    <div className="rounded border p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg text-primary sm:text-xl">{`${fieldTitle}`}</h3>
        </div>
        {isApplicationEditable(application!) && (
          <>
            <input
              type="file"
              id={`input-file-${field.id}`}
              disabled={isLoading}
              onChange={onFileUpload}
              className="hidden"
            />
            <label
              htmlFor={`input-file-${field.id}`}
              className={`cursor-pointer rounded-lg bg-info p-2 py-2 text-[9px] font-bold tracking-wide text-white transition-colors duration-200 hover:opacity-80 sm:w-auto sm:px-4 sm:text-xs ${isLoading ? "cursor-not-allowed opacity-10" : ""}`}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
              <span>Upload File</span>
            </label>
          </>
        )}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-6">
        {field.value &&
          field.value.split(",").map((attachmentId: string) => {
            const attachment = application?.attachments.find(
              (a) => a.id === parseInt(attachmentId),
            );
            return (
              attachment && (
                <li key={attachmentId} className="list-none">
                  <FileUploaded
                    attachment={attachment}
                    formId={formId}
                    fieldId={field.id}
                  />
                </li>
              )
            );
          })}
      </ul>
    </div>
  );
}

export default FieldContainer;
