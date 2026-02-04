// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { RetrievedApplicationData } from "@/app/api/access-management-v1";
import { SectionProps } from "../ApplicationFormContent";
const Section7: React.FC<SectionProps> = ({ applicationData }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Further information or any additional notes */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Further information or any additional notes
        </label>
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            Here you can provide further information on any of the sections in
            your application. Indicate the number of section and the question to
            which your comment refers.
          </span>
        </div>
        <textarea
          rows={6}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* An additional attachment */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          An additional attachment. Do not attach health or personal data to
          this application.
        </label>
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            If you have any other attachment that you deem important regarding
            the processing of your application and necessary for the Health Data
            Access Body to use, attach it here. Describe its relevance in the
            text field above.
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Only pdf, doc, docx, xls, xlsx, odt files. Maximum size is 5 MB.
        </p>
        <textarea
          rows={4}
          placeholder="Describe the relevance of your attachment"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary mb-3"
        />
        <button className="rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-secondary">
          Select Files
        </button>
      </div>

      {/* Go To Top Button */}
      <div className="flex justify-end pb-8">
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

export default Section7;
