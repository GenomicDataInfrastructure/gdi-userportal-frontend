// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faClose, faFileCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FileUploaded() {
  return (
    <div className="relative mt-5 flex items-center justify-between gap-x-3 rounded border-2 bg-white-smoke px-3 py-1.5">
      <div className="flex items-center gap-x-4">
        <FontAwesomeIcon
          icon={faFileCircleCheck}
          className="text-base text-info"
        />
        <h3 className="text-sm text-info">File1.pdf</h3>
      </div>
      <FontAwesomeIcon icon={faClose} className="border-1 text-sm text-info" />
    </div>
  );
}

export default FileUploaded;
