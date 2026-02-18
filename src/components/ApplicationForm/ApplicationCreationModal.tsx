// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

interface ApplicationCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    applicationType: string;
    language: string;
    name: string;
  }) => void;
}

const ApplicationCreationModal: React.FC<ApplicationCreationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [applicationType, setApplicationType] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [applicationName, setApplicationName] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCreate = () => {
    if (applicationType && language && applicationName) {
      onCreate({ applicationType, language, name: applicationName });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Important Information for Creation of an Application
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Application Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              What kind of data do you need?
            </label>
            <div className="space-y-3">
              <div className="flex items-start p-4 border border-gray-300 rounded-lg hover:bg-surface transition-colors cursor-pointer">
                <input
                  type="radio"
                  id="data-request"
                  name="applicationType"
                  value="data-request"
                  checked={applicationType === "data-request"}
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="mt-1 mr-3 h-4 w-4"
                />
                <label
                  htmlFor="data-request"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  1. I need data in an anonymized statistical format. I
                  understand that I will have no access to the electronic health
                  data used to provide the requested data (Data Request
                  application).
                </label>
              </div>
              <div className="flex items-start p-4 border border-gray-300 rounded-lg hover:bg-surface transition-colors cursor-pointer">
                <input
                  type="radio"
                  id="data-access"
                  name="applicationType"
                  value="data-access"
                  checked={applicationType === "data-access"}
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="mt-1 mr-3 h-4 w-4"
                />
                <label
                  htmlFor="data-access"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  2. I need personal level data in an anonymized or a
                  pseudonymised format. I am aware that processing this kind of
                  data is possible only in an audited secure processing
                  environment (Data Access application).
                </label>
              </div>
            </div>
          </div>

          {/* Collapsible Information Sections */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            {/* General Information about data access */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("general")}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface transition-colors"
              >
                <span className="font-medium text-gray-900">
                  General Information about data access
                </span>
                <FontAwesomeIcon
                  icon={
                    expandedSection === "general" ? faChevronUp : faChevronDown
                  }
                  className="text-gray-500"
                />
              </button>
              {expandedSection === "general" && (
                <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-700 space-y-3">
                  <p className="font-medium">
                    Data access can only be authorised if the data are to be
                    used for one or more of the following purposes:
                  </p>
                  <ul className="list-none space-y-2 pl-4">
                    <li>
                      a) the public interest in the areas of public or
                      occupational health...
                    </li>
                    <li>b) policy-making and regulatory activities...</li>
                    <li>c) statistics as defined in Article 3, point (1)...</li>
                    <li>d) education or teaching activities...</li>
                    <li>
                      e) scientific research related to health or care
                      sectors...
                    </li>
                    <li>f) improvement of the delivery of care...</li>
                  </ul>
                  <p className="font-medium mt-4">
                    Data access cannot be granted for prohibited purposes.
                    Prohibited uses of data are:
                  </p>
                  <ul className="list-none space-y-2 pl-4">
                    <li>
                      a) taking decisions detrimental to a natural person...
                    </li>
                    <li>
                      b) taking decisions in relation to a natural person...
                    </li>
                    <li>c) carrying out advertising or marketing activities</li>
                    <li>
                      d) developing products or services that may harm
                      individuals...
                    </li>
                    <li>
                      e) carrying out activities in conflict with ethical
                      provisions...
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Type of data access */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("type")}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface transition-colors"
              >
                <span className="font-medium text-gray-900">
                  Type of data access
                </span>
                <FontAwesomeIcon
                  icon={
                    expandedSection === "type" ? faChevronUp : faChevronDown
                  }
                  className="text-gray-500"
                />
              </button>
              {expandedSection === "type" && (
                <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
                  <p>
                    Access is granted primarily to electronic health data in an
                    aggregated anonymous format (via a data request form).
                    Access to personal level electronic health data in
                    pseudonymised format can be given (via a data permit
                    application form) in cases where the purpose of data
                    processing cannot be achieved with anonymised data.
                  </p>
                </div>
              )}
            </div>

            {/* Availability of data in different EU countries */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("availability")}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface transition-colors"
              >
                <span className="font-medium text-gray-900">
                  Availability of data in different EU countries
                </span>
                <FontAwesomeIcon
                  icon={
                    expandedSection === "availability"
                      ? faChevronUp
                      : faChevronDown
                  }
                  className="text-gray-500"
                />
              </button>
              {expandedSection === "availability" && (
                <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
                  <p>
                    The availability of data in different EU countries vary in
                    terms of amount, scope and organisation of data. You can
                    browse the available data in the EHDS metadata catalogue.
                  </p>
                </div>
              )}
            </div>

            {/* Penalties for misuse of electronic health data */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("penalties")}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface transition-colors"
              >
                <span className="font-medium text-gray-900">
                  Penalties for misuse of electronic health data
                </span>
                <FontAwesomeIcon
                  icon={
                    expandedSection === "penalties"
                      ? faChevronUp
                      : faChevronDown
                  }
                  className="text-gray-500"
                />
              </button>
              {expandedSection === "penalties" && (
                <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
                  <p>
                    Health Data Access Bodies shall monitor and supervise
                    compliance by data users and data holders with the
                    requirements laid down in the European Health Data Space
                    Regulation. Health Data Access Bodies have the power to
                    revoke the data permit issued and stop the affected
                    electronic health data processing operation carried out by
                    the data user. You can find more information on the correct
                    use and penalties for misuse of electronic health data here.
                  </p>
                </div>
              )}
            </div>

            {/* Attachments */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("attachments")}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface transition-colors"
              >
                <span className="font-medium text-gray-900">Attachments</span>
                <FontAwesomeIcon
                  icon={
                    expandedSection === "attachments"
                      ? faChevronUp
                      : faChevronDown
                  }
                  className="text-gray-500"
                />
              </button>
              {expandedSection === "attachments" && (
                <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
                  <p>
                    You are required to attach some documents to your
                    application, such as the extraction description form. The
                    number of necessary attachments may vary depending on the
                    country and data holder from which you are requesting data.
                    For example, some countries require applicants to acquire an
                    ethical committee clearance or an ethics committee decision
                    before granting data. Once you indicate the purpose of data
                    use, the country/countries and the data holders from which
                    you seek data, the application form will show you which
                    documents you need to attach to your application.
                  </p>
                </div>
              )}
            </div>

            {/* Fees */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("fees")}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface transition-colors"
              >
                <span className="font-medium text-gray-900">Fees</span>
                <FontAwesomeIcon
                  icon={
                    expandedSection === "fees" ? faChevronUp : faChevronDown
                  }
                  className="text-gray-500"
                />
              </button>
              {expandedSection === "fees" && (
                <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
                  <p>
                    The Health Data Access Bodies and single data holder(s) may
                    charge fees for making electronic health data available for
                    secondary use. Any fees shall include and be derived from
                    the costs related to conducting the procedure for requests,
                    including for assessing a data application or a data
                    request, refusing or amending a data permit or providing an
                    answer to a data request. A processing fee will be charged
                    for processing the application. It will also apply in case
                    of a cancelled request or a negative decision.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Data Privacy Statement */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start p-3 bg-surface rounded-lg">
              <input
                type="checkbox"
                id="privacy-statement"
                className="mt-1 mr-3 h-4 w-4"
              />
              <label
                htmlFor="privacy-statement"
                className="text-sm text-gray-700 leading-relaxed"
              >
                By filling in the application form, you accept that your
                personal data will be collected and used for processing the
                application and delivering you the requested data, if granted.
                The use of your personal data will be limited strictly to the
                amount necessary.
              </label>
            </div>
          </div>

          {/* Input Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Input language <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm appearance-none focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select language</option>
                <option value="bg">Bulgarian</option>
                <option value="hr">Croatian</option>
                <option value="cs">Czech</option>
                <option value="da">Danish</option>
                <option value="nl">Dutch</option>
                <option value="en">English</option>
                <option value="et">Estonian</option>
                <option value="fi">Finnish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="el">Greek</option>
                <option value="hu">Hungarian</option>
                <option value="ga">Irish</option>
                <option value="it">Italian</option>
                <option value="lv">Latvian</option>
                <option value="lt">Lithuanian</option>
                <option value="mt">Maltese</option>
                <option value="pl">Polish</option>
                <option value="pt">Portuguese</option>
                <option value="ro">Romanian</option>
                <option value="sk">Slovak</option>
                <option value="sl">Slovenian</option>
                <option value="es">Spanish</option>
                <option value="sv">Swedish</option>
                <option value="is">Icelandic</option>
                <option value="nb">Norwegian Bokmål</option>
                <option value="nn">Norwegian Nynorsk</option>
              </select>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-primary p-2 rounded pointer-events-none text-xs"
              />
            </div>
          </div>

          {/* Application Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Application name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={applicationName}
              onChange={(e) => setApplicationName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleCreate}
            disabled={!applicationType || !language || !applicationName}
            className="rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCreationModal;
