// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "./button";
import FileUploaded from "./fileUploaded";

type FieldAttachmentContainerProps = {
  fieldName: string;
};

function FieldAttachmentContainer({
  fieldName,
}: FieldAttachmentContainerProps) {
  return (
    <div className="mt-10 rounded border-2 border-white-smoke p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-2xl text-primary">{`${fieldName} Attachment`}</h3>
        </div>
        <Button
          type="info"
          text="Upload file"
          className="text-xs"
          icon={faPlusCircle}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6">
        <FileUploaded />
        <FileUploaded />
        <FileUploaded />
      </div>
    </div>
  );
}

export default FieldAttachmentContainer;
