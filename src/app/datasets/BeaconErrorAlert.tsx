// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BeaconErrorAlertProps = {
  error: string;
};

export default function BeaconErrorAlert({ error }: BeaconErrorAlertProps) {
  return (
    <div className="mb-6 shadow-lg rounded-lg border-l-4 border-l-warning bg-warning/5 p-4">
      <div className="flex items-start gap-3">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="mt-1 h-5 w-5 text-warning flex-shrink-0"
        />
        <div className="flex-1">
          <div className="font-semibold text-base mb-1">
            Beacon Network Unavailable
          </div>
          <p className="text-sm text-gray-700">
            {error}. Results shown are from the main catalog only.
          </p>
        </div>
      </div>
    </div>
  );
}
