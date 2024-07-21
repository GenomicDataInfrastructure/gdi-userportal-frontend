// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { Attachment } from "@/types/application.types";
import { faClose, faFileCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type FileUploadedProps = {
  attachment: Attachment;
  formId: number;
  fieldId: number;
  isEditable: boolean;
  onFieldChange: (fieldId: number, newValue: string) => void;
};

function FileUploaded({
  attachment,
  formId,
  fieldId,
  isEditable,
  onFieldChange,
}: FileUploadedProps) {
  const { isLoading, deleteAttachment } = useApplicationDetails();

  const handleDelete = async () => {
    await deleteAttachment(formId, fieldId, attachment.id);
    onFieldChange(fieldId, "");
  };

  return (
    <div className="relative mt-5 flex items-center justify-between gap-x-1 break-all rounded border-2 bg-surface px-3 py-1.5 sm:gap-x-3">
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        <FontAwesomeIcon
          icon={faFileCircleCheck}
          className="text-base text-info"
        />
        <h3 className="text-sm text-info">{attachment.filename}</h3>
      </div>
      {isEditable && (
        <FontAwesomeIcon
          icon={faClose}
          className={`border-1 cursor-pointer rounded-full p-1.5 text-sm text-info transition-colors duration-200 hover:text-primary ${
            isLoading ? "pointer-events-none opacity-10" : ""
          }`}
          onClick={handleDelete}
        />
      )}
    </div>
  );
}

export default FileUploaded;
