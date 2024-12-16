// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileUploaded from "./FileUploaded";
import { RetrievedApplicationFormField } from "@/app/api/access-management/open-api/schemas";

type FileUploadFormFieldProps = {
  field: RetrievedApplicationFormField;
  formId: number;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function FileUploadFormField({
  field,
  formId,
  title,
  editable,
  validationWarning,
}: FileUploadFormFieldProps) {
  const { application, isLoading, addAttachment } = useApplicationDetails();

  async function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];
    const formData = new FormData();
    formData.set("file", file);
    await addAttachment(formId, field.id!, formData);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg sm:text-xl">{`${title} ${
            field.optional ? "(Optional)" : ""
          }`}</h3>
        </div>
        <>
          <input
            type="file"
            id={`input-file-${field.id}`}
            disabled={isLoading || !editable}
            onChange={onFileUpload}
            className="hidden"
          />
          <label
            htmlFor={`input-file-${field.id}`}
            className={`bg-info text-white rounded-md px-4 py-2 font-bold transition-colors duration-200 tracking-wide sm:w-auto ${
              isLoading || !editable
                ? "cursor-not-allowed opacity-50"
                : "hover:opacity-80 cursor-pointer"
            }`}
          >
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2 text-sm" />
            <span className="text-sm">Upload File</span>
          </label>
        </>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-6">
        {field.value &&
          field.value.split(",").map((attachmentId: string) => {
            const attachment = application?.attachments?.find(
              (a) => a.id === parseInt(attachmentId)
            );
            return (
              attachment && (
                <li key={attachmentId} className="list-none">
                  <FileUploaded
                    attachment={attachment}
                    formId={formId}
                    fieldId={field.id!}
                  />
                </li>
              )
            );
          })}
      </ul>
      {validationWarning && (
        <span className="text-red-600 mt-1">{validationWarning}</span>
      )}
    </div>
  );
}

export default FileUploadFormField;
