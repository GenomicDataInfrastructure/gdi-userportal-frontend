// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Alert, { AlertState } from "@/components/Alert";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import {
  faCheckCircle,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@/types/application.types";

export default function TermsAcceptance() {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const { application, acceptTerms, clearError } = useApplicationDetails();
  const [expandedLicenseId, setExpandedLicenseId] = useState<string | null>(
    null
  );

  async function handleAcceptTerms() {
    try {
      setAlert(null);
      clearError();
      const acceptedLicenses = application!.licenses
        .filter((license) => !license.acceptedByCurrentUser)
        .map((license) => license.id);

      await acceptTerms(acceptedLicenses);
      setAlert({
        message: "All terms accepted successfully.",
        type: "success",
      });
    } catch (error) {
      setAlert({
        message: "Failed to accept terms. Please try again.",
        type: "error",
      });
    }
  }

  const allTermsAccepted = application?.licenses.every(
    (license) => license.acceptedByCurrentUser
  );

  const handleTextClick = (id: string) => {
    setExpandedLicenseId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="border-gray flex flex-col gap-3 rounded-sm border-2 bg-surface p-5 text-black mt-5">
      <h2 className="text-xl font-bold mb-4 text-primary">
        Terms and Conditions
      </h2>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}
      <div className="space-y-4">
        {application?.licenses.map((license) => (
          <div key={license.id} className="space-y-2">
            <h3 className="font-semibold">{formatLabels(license.title)}</h3>
            <p
              className={`cursor-pointer transition-all ${expandedLicenseId === license.id.toString() ? "line-clamp-none" : "line-clamp-3"}`}
              onClick={() => handleTextClick(license.id.toString())}
            >
              {formatLabels(license.text)}
            </p>
            {license.link.length > 0 && (
              <a
                href={formatLabels(license.link)}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
                <FontAwesomeIcon
                  className="ml-2"
                  icon={faArrowUpRightFromSquare}
                />
              </a>
            )}
            <p>
              {license.acceptedByCurrentUser ? (
                <span className="text-green-600">Accepted</span>
              ) : (
                <span className="text-red-600">Not Accepted</span>
              )}
            </p>
          </div>
        ))}
      </div>
      {!allTermsAccepted && (
        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            text="Accept All"
            icon={faCheckCircle}
            onClick={handleAcceptTerms}
          />
        </div>
      )}
    </div>
  );
}

function formatLabels(labels: Label[]): string {
  return labels.map((label) => label.name).join(" ");
}
