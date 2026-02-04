// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { RetrievedApplicationData } from "@/app/api/access-management-v1";
import { SectionProps } from "../ApplicationFormContent";

const Section5: React.FC<SectionProps> = ({ applicationData }) => {
  const [showAllPurposes, setShowAllPurposes] = useState(false);
  const [sameAsDataUse, setSameAsDataUse] = useState(false);
  const [sameAsResearch, setSameAsResearch] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const purposes = [
    {
      id: "a",
      title:
        "a. The public interest in the areas of public or occupational health, such as activities to protect against serious cross-border threats to health, public health surveillance or activities ensuring high levels of quality and safety of healthcare, including patient safety, and of medicinal products or medical devices.",
    },
    {
      id: "b",
      title:
        "b. Policy making and regulatory activities to support public sector bodies or Union institutions, bodies, offices and agencies, including regulatory authorities, in the health or care sector to carry out their tasks defined in their mandates.",
    },
    {
      id: "c",
      title:
        "c. Statistics as defined in Article 3, point (1), of Regulation (EU) No 223/2009, such as national, multi-national and Union level official statistics, related to health or care sectors.",
    },
    {
      id: "d",
      title:
        "d. Education or teaching activities in health or care sectors at vocational or higher education level.",
    },
    {
      id: "e",
      title:
        "e. Scientific research related to health or care sectors that contributes to public health or health technology assessment, or ensures high levels of quality and safety of healthcare, of medicinal products or of medical devices, with the aim of benefitting end-users, such as patients, health professionals and health administrators, including:\n(i) development and innovation activities for products or services;\n(ii) training, testing and evaluation of algorithms, including in medical devices, in vitro diagnostic medical devices, AI systems and digital health applications.",
    },
  ];

  return (
    <>
      {/* About this section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800">
          About this section
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Applicants should indicate the purpose for which data are sought,
          according to the Article 53(1) of Regulation (EU) 2022/55 (the
          European Health Data Space Regulation), and provide a concise
          description of what is necessary for their indicated purpose of use.
          Applicants are also asked to provide information on the aims of the
          project. This helps the health data access body to assess whether
          research or not research), applicants need to provide a summary of the
          plan for using the data or a summary of the research plan, and
          information on the potential use of the data set or research.
        </p>
      </div>

      {/* Purpose of data use section */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Purpose of data use. Health data access bodies shall only provide
          access to electronic health data referred to in Article 51 where the
          intended purpose of processing pursued by the applicant complies with
          the following purposes listed hereafter:
        </h3>

        <div className="space-y-3">
          {purposes
            .slice(0, showAllPurposes ? purposes.length : 3)
            .map((purpose) => (
              <div key={purpose.id} className="flex items-start">
                <input
                  type="checkbox"
                  id={`purpose-${purpose.id}`}
                  className="mt-1 mr-3 h-4 w-4"
                />
                <label
                  htmlFor={`purpose-${purpose.id}`}
                  className="text-sm text-gray-700 leading-relaxed whitespace-pre-line"
                >
                  {purpose.title}
                </label>
              </div>
            ))}
        </div>

        {!showAllPurposes && (
          <button
            onClick={() => setShowAllPurposes(true)}
            className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-secondary"
          >
            <span>Show More</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </button>
        )}
      </div>

      {/* Person responsible for data use */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Person responsible for data use
        </h3>

        <div className="flex items-start mb-4">
          <input
            type="checkbox"
            id="same-contact-data"
            checked={sameAsDataUse}
            onChange={(e) => setSameAsDataUse(e.target.checked)}
            className="mt-1 mr-3 h-4 w-4"
          />
          <label htmlFor="same-contact-data" className="text-sm text-gray-700">
            Same as contact person mentioned in the section 3 (Applicant and
            contact person information)?
          </label>
        </div>

        <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary mb-4">
          <span>⇄</span>
          <span>Fill from user profile</span>
        </button>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Person responsible for the research */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Person responsible for the research
        </h3>

        <div className="flex items-start mb-4">
          <input
            type="checkbox"
            id="same-contact-research"
            checked={sameAsResearch}
            onChange={(e) => setSameAsResearch(e.target.checked)}
            className="mt-1 mr-3 h-4 w-4"
          />
          <label
            htmlFor="same-contact-research"
            className="text-sm text-gray-700"
          >
            Same as contact person mentioned in the section 3 (Applicant and
            contact person information)?
          </label>
        </div>

        <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary mb-4">
          <span>⇄</span>
          <span>Fill from user profile</span>
        </button>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Full name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Why are the data requested */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Why are the data requested with this application needed for the
          indicated purpose of use? <span className="text-red-600">*</span>
        </label>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Aim and topic of project */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          What is the aim and topic of your project?{" "}
          <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Expected benefit */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Which is the expected benefit related to the use of the electronic
          health data and how this benefit contributes to the purposes referred
          to in 5.1? <span className="text-red-600">*</span>
        </label>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Applicant qualifications */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Describe the applicant's qualifications in relation to the intended
          purpose(s) of data use and appropriate expertise (incl. professional
          qualifications) <span className="text-red-600">*</span>
        </label>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Legal basis */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Specify the legal basis, for example the relevant legislation, which
          defines the tasks falling within your mandate and confirm that your
          planned use of the data is to facilitate such tasks.{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            For example: Applicants subject to Regulation (EU) No 2016/679 shall
            specify the category of the requested statistics correspond to the
            purpose of use stated in the application and meet your data
            requirements.
          </span>
        </div>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Link to supporting documentation */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Provide a link to the supporting documentation as evidence of the
          legal basis <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Summary of plan for using data */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Provide a summary of your plan for using the data. The summary must be
          written in one of the official EU languages{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            Uploaded files are automatically translated by the system. The
            applicant is responsible for the quality, legibility, and formatting
            of the uploaded files. Only pdf, doc, docx, xls, xlsx, odt files.
            Maximum size is 5 MB.
          </span>
        </div>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary mb-2"
        />
        <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
          Select Files
        </button>
      </div>

      {/* Summary of research plan */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Provide a summary of your research plan. The summary must be written
          in one of the official EU languages{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            Uploaded files are automatically translated by the system. The
            applicant is responsible for the quality, legibility, and formatting
            of the uploaded files. Only pdf, doc, docx, xls, xlsx, odt files.
            Maximum size is 5 MB.
          </span>
        </div>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary mb-2"
        />
        <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
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

export default Section5;
