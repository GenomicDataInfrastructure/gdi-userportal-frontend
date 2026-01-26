// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const Section2: React.FC = () => {
  const [showAllPurposes, setShowAllPurposes] = useState(false);
  const [noSummary, setNoSummary] = useState(false);

  const purposes = [
    "a. The public interest in the areas of public or occupational health, such as activities to protect against serious cross-border threats to health, public health surveillance or activities ensuring high levels of quality and safety of healthcare, including patient safety, and of medicinal products or medical devices.",
    "b. Policy making and regulatory activities to support public sector bodies or Union institutions, bodies, offices and agencies, including regulatory authorities, in the health or care sector to carry out their tasks defined in their mandates.",
    "c. Statistics as defined in Article 3, point (1), of Regulation (EU) No 223/2009, such as national, multi-national and Union level official statistics, related to health or care sectors.",
    "d. Education or teaching activities in health or care sectors at vocational or higher education level.",
    "e. Scientific research related to health or care sectors that contributes to public health or health technology assessment, or ensures high levels of quality and safety of healthcare, of medicinal products or of medical devices, with the aim of benefitting end-users, such as patients, health professionals and health administrators, including:\n(i) development and innovation activities for products or services;\n(ii) training, testing and evaluation of algorithms, including in medical devices, in vitro diagnostic medical devices, AI systems and digital health applications.",
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* About this section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800">
          About this section
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          The health data access bodies in the European Union are obliged to
          publish information on the data permits, requests and applications on
          their website within 30 working days after issuance of the data permit
          or reply to a data request. In this section, you are asked to provide
          information on your project that can be shared with the public. Make
          sure this does not include any confidential information.
        </p>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Provide your answers in layperson's terms. As a data user, you will be
          obliged to make public the results or output of the project no later
          than 18 months after the completion of the project or the receipt of
          the answer to the data request. In addition, you must inform the
          health data access body of the number of peer-reviewed research
          publications, policy documents, and/or regulatory procedures conducted
          using the data accessed via this application.
        </p>
      </div>

      {/* Project name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Project name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Project leader name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Project leader name (organisation, institution, private sector entity,
          or a natural person) <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            This is the person responsible for data use
          </span>
        </div>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Official domicile */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Official domicile (country) of the entity responsible for the project{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="">Select a country</option>
            <option value="NL">Netherlands</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="ES">Spain</option>
          </select>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"
          />
        </div>
      </div>

      {/* Purpose for which data will be used */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Purpose for which the data will be used{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            Purposes from the EHDS regulation.
          </span>
        </div>
        <div className="space-y-3">
          {purposes
            .slice(0, showAllPurposes ? purposes.length : 3)
            .map((purpose, index) => (
              <div key={index} className="flex items-start">
                <input
                  type="checkbox"
                  id={`purpose-${index}`}
                  className="mt-1 mr-3 h-4 w-4"
                />
                <label
                  htmlFor={`purpose-${index}`}
                  className="text-sm text-gray-700 leading-relaxed"
                >
                  {purpose}
                </label>
              </div>
            ))}
        </div>
        {!showAllPurposes && (
          <button
            onClick={() => setShowAllPurposes(true)}
            className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-secondary"
          >
            <span>Show More</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </button>
        )}
      </div>

      {/* Summary of the project */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Summary of the project <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            In layman's terms, provide a short (250 words or less) summary of
            the project's aims, data to be used, methods and what form of
            results are expected
          </span>
        </div>
        <textarea
          rows={6}
          disabled={noSummary}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <div className="mt-2 flex items-start">
          <input
            type="checkbox"
            id="no-summary"
            checked={noSummary}
            onChange={(e) => setNoSummary(e.target.checked)}
            className="mt-1 mr-3 h-4 w-4"
          />
          <label htmlFor="no-summary" className="text-sm text-gray-700">
            The nature of your project does not let you provide a summary
          </label>
        </div>
      </div>

      {/* Go To Top Button */}
      <div className="flex justify-end">
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

export default Section2;
