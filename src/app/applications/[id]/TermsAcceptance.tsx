// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Alert, { AlertState } from "@/components/Alert";
import Button from "@/components/Button";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { useTranslations } from "next-intl";
import { getLabelName } from "@/utils/getLabelName";
import {
  faArrowUpRightFromSquare,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function TermsAcceptance() {
  const t = useTranslations("application.terms");
  const [alert, setAlert] = useState<AlertState | null>(null);
  const { application, acceptTerms, clearError } = useApplicationDetails();
  const [expandedLicenseId, setExpandedLicenseId] = useState<string | null>(
    null
  );

  async function handleAcceptTerms() {
    setAlert(null);
    clearError();
    const acceptedLicenses = application?.licenses
      ?.filter((license) => !license.acceptedByCurrentUser)
      .map((license) => license.id);

    if (acceptedLicenses && acceptedLicenses.length > 0) {
      await acceptTerms(acceptedLicenses as number[]);
    }
  }

  const allTermsAccepted = application?.licenses?.every(
    (license) => license.acceptedByCurrentUser
  );

  const handleTextClick = (id: string) => {
    setExpandedLicenseId((prevId) => (prevId === id ? null : id));
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    id: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTextClick(id);
    }
  };

  if (!application?.licenses || application?.licenses.length === 0) {
    return <p>{t("noTermsDefined")}</p>;
  }

  return (
    <div className="text-base">
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
            <h3 className="">{getLabelName(license.title!)}</h3>
            <button
              className={`text-left w-full cursor-pointer transition-all ${
                expandedLicenseId === license.id!.toString()
                  ? "line-clamp-none"
                  : "line-clamp-3"
              }`}
              onClick={() => handleTextClick(license.id!.toString())}
              onKeyPress={(event) =>
                handleKeyPress(event, license.id!.toString())
              }
            >
              {getLabelName(license.text!)}
            </button>
            {license.link!.length > 0 && (
              <a
                href={getLabelName(license.link!)}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("readMore")}
                <FontAwesomeIcon
                  className="ml-2"
                  icon={faArrowUpRightFromSquare}
                />
              </a>
            )}
            <p>
              {license.acceptedByCurrentUser ? (
                <span className="text-green-600">{t("accepted")}</span>
              ) : (
                <span className="text-red-600">{t("notAccepted")}</span>
              )}
            </p>
          </div>
        ))}
      </div>
      {!allTermsAccepted && (
        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            text={t("acceptAll")}
            icon={faCheckCircle}
            onClick={handleAcceptTerms}
          />
        </div>
      )}
    </div>
  );
}
