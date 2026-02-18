// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { UpdateApplicationSection8Request } from "@/app/api/access-management-v1";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faInfoCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { SectionProps } from "../ApplicationFormContent";

const Section8: React.FC<SectionProps> = ({
  applicationData,
  sectionDataRef,
}) => {
  const [confirmations, setConfirmations] = useState({
    acceptHealthDataBody: false,
    awareProcessingFee: false,
    awareChargeFee: false,
    awareInformationCorrect: false,
  });

  // Initialize confirmations from applicationData
  useEffect(() => {
    if (applicationData?.form?.section8) {
      console.log(
        "📋 Section8 Data from applicationData:",
        applicationData.form.section8
      );

      setConfirmations({
        acceptHealthDataBody:
          applicationData.form.section8.acceptHealthDataBody ?? false,
        awareProcessingFee:
          applicationData.form.section8.awareProcessingFee ?? false,
        awareChargeFee: applicationData.form.section8.awareChargeFee ?? false,
        awareInformationCorrect:
          applicationData.form.section8.awareInformationCorrect ?? false,
      });

      if (
        Object.values(applicationData.form.section8).some((v) => v === true)
      ) {
        console.log(
          "✅ Found confirmed items in section8:",
          applicationData.form.section8
        );
      }
    } else {
      console.log("⚠️ No section8 data found in applicationData");
    }
  }, [applicationData?.form?.section8]);

  // Update sectionDataRef whenever confirmations change
  useEffect(() => {
    if (sectionDataRef) {
      const section8Data: UpdateApplicationSection8Request = {
        sectionNumber: 8,
        acceptHealthDataBody: confirmations.acceptHealthDataBody,
        awareProcessingFee: confirmations.awareProcessingFee,
        awareChargeFee: confirmations.awareChargeFee,
        awareInformationCorrect: confirmations.awareInformationCorrect,
      };
      console.log("📝 Updated Section8 Data:", section8Data);
      sectionDataRef.current = section8Data;
    }
  }, [sectionDataRef, confirmations]);

  const handleConfirmationChange = (key: keyof typeof confirmations): void => {
    setConfirmations((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key],
      };
      console.log(`Checkbox ${key} changed to: ${!prev[key]}`);
      return updated;
    });
  };

  // Calculate completion
  const checkedCount = Object.values(confirmations).filter(Boolean).length;
  const totalCount = Object.keys(confirmations).length;
  const completionPercentage = (checkedCount / totalCount) * 100;
  const allConfirmed = checkedCount === totalCount;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Confirmation of Information
        </h2>
        <p className="text-base text-gray-600">
          Before submitting your application, please review and confirm all
          required statements.
        </p>
      </div>

      {/* About this section */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex gap-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-blue-600 text-lg mt-0.5"
          />
          <div>
            <h3 className="text-base font-semibold text-blue-900 mb-2">
              Important Information
            </h3>
            <p className="text-sm text-blue-800">
              Before this application is processed, you must acknowledge
              processing fees and confirm the accuracy of all provided
              information. By submitting this application, you agree to the
              terms and processing conditions of the Health Data Access Body.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-900">
            Confirmations: {checkedCount}/{totalCount}
          </span>
          {allConfirmed && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-600"
              />
              Complete
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Confirmations required */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Please confirm the following:
        </h3>

        <div className="space-y-4">
          {/* Confirmation 1: Accept Health Data Body */}
          <div
            className={`p-5 border-2 rounded-lg transition-all ${
              confirmations.acceptHealthDataBody
                ? "border-green-400 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm-accept-health-data-body"
                checked={confirmations.acceptHealthDataBody}
                onChange={() =>
                  handleConfirmationChange("acceptHealthDataBody")
                }
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary transition-colors"
              />
              <div className="flex-1">
                <label
                  htmlFor="confirm-accept-health-data-body"
                  className="text-base font-semibold text-gray-900 cursor-pointer block mb-2"
                >
                  ✅ Accept Health Data Body Terms
                </label>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I accept that the Health Data Access Body will process this
                  request according to applicable regulations and I understand
                  the terms and conditions governing this data access.
                </p>
                {confirmations.acceptHealthDataBody && (
                  <div className="mt-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-sm"
                    />
                    <span className="text-xs font-semibold text-green-700">
                      Confirmed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation 2: Aware Processing Fee */}
          <div
            className={`p-5 border-2 rounded-lg transition-all ${
              confirmations.awareProcessingFee
                ? "border-green-400 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm-processing-fee"
                checked={confirmations.awareProcessingFee}
                onChange={() => handleConfirmationChange("awareProcessingFee")}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary transition-colors"
              />
              <div className="flex-1">
                <label
                  htmlFor="confirm-processing-fee"
                  className="text-base font-semibold text-gray-900 cursor-pointer block mb-2"
                >
                  💰 Processing Fee Acknowledgement
                </label>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I acknowledge that a processing fee will be charged for
                  processing my application. This fee applies regardless of
                  whether my request is approved, cancelled, or denied.
                </p>
                {confirmations.awareProcessingFee && (
                  <div className="mt-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-sm"
                    />
                    <span className="text-xs font-semibold text-green-700">
                      Acknowledged
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation 3: Aware Charge Fee */}
          <div
            className={`p-5 border-2 rounded-lg transition-all ${
              confirmations.awareChargeFee
                ? "border-green-400 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm-charge-fee"
                checked={confirmations.awareChargeFee}
                onChange={() => handleConfirmationChange("awareChargeFee")}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary transition-colors"
              />
              <div className="flex-1">
                <label
                  htmlFor="confirm-charge-fee"
                  className="text-base font-semibold text-gray-900 cursor-pointer block mb-2"
                >
                  💳 Data Holder Charge Fee Awareness
                </label>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I am aware that individual data holders may charge additional
                  fees for copying and transmitting health data. These charges
                  will be communicated separately.
                </p>
                {confirmations.awareChargeFee && (
                  <div className="mt-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-sm"
                    />
                    <span className="text-xs font-semibold text-green-700">
                      Acknowledged
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation 4: Information Correct */}
          <div
            className={`p-5 border-2 rounded-lg transition-all ${
              confirmations.awareInformationCorrect
                ? "border-green-400 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm-information-correct"
                checked={confirmations.awareInformationCorrect}
                onChange={() =>
                  handleConfirmationChange("awareInformationCorrect")
                }
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary transition-colors"
              />
              <div className="flex-1">
                <label
                  htmlFor="confirm-information-correct"
                  className="text-base font-semibold text-gray-900 cursor-pointer block mb-2"
                >
                  📋 Information Correctness Confirmation
                </label>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I confirm that all information provided in this application is
                  accurate, complete, and truthful to the best of my knowledge.
                  I understand that providing false information may result in
                  rejection.
                </p>
                {confirmations.awareInformationCorrect && (
                  <div className="mt-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-sm"
                    />
                    <span className="text-xs font-semibold text-green-700">
                      Confirmed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {allConfirmed ? (
        <div className="mb-8 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-600 text-xl mt-0.5"
          />
          <div>
            <p className="text-sm font-bold text-green-900">
              ✅ All Confirmations Complete!
            </p>
            <p className="text-xs text-green-800 mt-1">
              Your application is ready to be submitted. Click Save when you are
              ready to proceed.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-start gap-3">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-amber-600 text-xl mt-0.5"
          />
          <div>
            <p className="text-sm font-bold text-amber-900">
              ⚠️ Incomplete Confirmations
            </p>
            <p className="text-xs text-amber-800 mt-1">
              Please review and confirm all {totalCount} statements before
              submitting. You have confirmed {checkedCount} of {totalCount}.
            </p>
          </div>
        </div>
      )}

      {/* Go To Top Button */}
      <div className="flex justify-end pb-8 mt-8">
        <button
          onClick={scrollToTop}
          className="rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-200"
        >
          Go To Top
        </button>
      </div>
    </>
  );
};

export default Section8;
