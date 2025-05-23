// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { isApplicationEditable } from "@/utils/application";
import { faClose, faFileCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RetrievedApplicationAttachment } from "@/app/api/access-management/open-api/schemas";

type FileUploadedProps = {
  attachment: RetrievedApplicationAttachment;
  formId: number;
  fieldId: string;
};

function FileUploaded({ attachment, formId, fieldId }: FileUploadedProps) {
  const { application, isLoading, deleteAttachment } = useApplicationDetails();
  return (
    <div className="relative mt-5 flex items-center justify-between gap-x-1 break-all rounded-sm border-2 bg-surface px-3 py-1.5 sm:gap-x-3">
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        <FontAwesomeIcon
          icon={faFileCircleCheck}
          className="text-base text-info"
        />
        <h3 className="text-md text-info">{attachment.filename}</h3>
      </div>
      {isApplicationEditable(application!) && (
        <FontAwesomeIcon
          icon={faClose}
          className={`border-1 cursor-pointer rounded-full p-1.5 text-md text-info transition-colors duration-200 hover:text-primary ${
            isLoading ? "pointer-events-none opacity-10" : ""
          }`}
          onClick={() => deleteAttachment(formId, fieldId, attachment.id!)}
        />
      )}
    </div>
  );
}

export default FileUploaded;
