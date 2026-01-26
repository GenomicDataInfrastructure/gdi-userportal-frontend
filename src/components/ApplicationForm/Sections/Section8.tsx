// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";

const Section8: React.FC = () => {
  const [confirmations, setConfirmations] = useState({
    statistics: false,
    processingFee: false,
    holderFee: false,
    informationCorrect: false,
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmationChange = (key: keyof typeof confirmations) => {
    setConfirmations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* About this section */}
      <div className="mb-8 bg-surface rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          About this section
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Before this application is processed, you as the applicant must
          approve processing fees. To add information on the prices and the
          maximum price estimate for data extraction once available.
        </p>
      </div>

      {/* Confirmations required */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-6">
          To submit your application, you need to confirm the following:
        </h3>

        <div className="space-y-4">
          {/* Confirmation 1 */}
          <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-surface transition-colors">
            <input
              type="checkbox"
              id="confirm-statistics"
              checked={confirmations.statistics}
              onChange={() => handleConfirmationChange("statistics")}
              className="mt-1 mr-3 h-4 w-4"
            />
            <label
              htmlFor="confirm-statistics"
              className="text-sm text-gray-700 leading-relaxed"
            >
              I accept that the health data body will compile the statistics and
              I will have no access to the data used to form the statistics.
            </label>
          </div>

          {/* Confirmation 2 */}
          <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-surface transition-colors">
            <input
              type="checkbox"
              id="confirm-processing-fee"
              checked={confirmations.processingFee}
              onChange={() => handleConfirmationChange("processingFee")}
              className="mt-1 mr-3 h-4 w-4"
            />
            <label
              htmlFor="confirm-processing-fee"
              className="text-sm text-gray-700 leading-relaxed"
            >
              I am aware that a processing fee will be charged for processing my
              application. It will also apply in case of a cancelled request or
              negative decision.
            </label>
          </div>

          {/* Confirmation 3 */}
          <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-surface transition-colors">
            <input
              type="checkbox"
              id="confirm-holder-fee"
              checked={confirmations.holderFee}
              onChange={() => handleConfirmationChange("holderFee")}
              className="mt-1 mr-3 h-4 w-4"
            />
            <label
              htmlFor="confirm-holder-fee"
              className="text-sm text-gray-700 leading-relaxed"
            >
              I am aware that data holder(s) may charge a fee.{" "}
              <span className="text-red-600">*</span>
            </label>
          </div>

          {/* Confirmation 4 */}
          <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-surface transition-colors">
            <input
              type="checkbox"
              id="confirm-information"
              checked={confirmations.informationCorrect}
              onChange={() => handleConfirmationChange("informationCorrect")}
              className="mt-1 mr-3 h-4 w-4"
            />
            <label
              htmlFor="confirm-information"
              className="text-sm text-gray-700 leading-relaxed"
            >
              I confirm that the information I have provided is correct.{" "}
              <span className="text-red-600">*</span>
            </label>
          </div>
        </div>
      </div>

      {/* Go To Top Button */}
      <div className="flex justify-end pt-8 pb-8">
        <button
          onClick={scrollToTop}
          className="rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-secondary"
        >
          Go To Top
        </button>
      </div>
    </>
  );
};

export default Section8;
