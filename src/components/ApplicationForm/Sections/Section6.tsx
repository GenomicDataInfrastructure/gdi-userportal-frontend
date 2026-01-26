// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

type TabType = "section6" | "section6.1";

interface TabulationPlan {
  id: string;
  data?: string;
}

const Section6: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("section6");
  const [cohortSize, setCohortSize] = useState<string>("12");
  const [cohortSizeType, setCohortSizeType] = useState<string>("estimation");
  const [extractionMethod, setExtractionMethod] =
    useState<string>("random-sample");
  const [tabulationPlans, setTabulationPlans] = useState<TabulationPlan[]>([
    { id: "1" },
  ]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addTabulationPlan = () => {
    const newId =
      Math.max(...tabulationPlans.map((p) => parseInt(p.id)), 0) + 1;
    setTabulationPlans([...tabulationPlans, { id: newId.toString() }]);
  };

  const removeTabulationPlan = (id: string) => {
    if (tabulationPlans.length > 1) {
      setTabulationPlans(tabulationPlans.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      {/* About this section */}
      <div className="mb-8 bg-surface rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          About this section
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          In this section, you need to provide a description of the requested
          dataset, clearly indicating which datasets the application concerns.
          You should only apply for data that are adequate, relevant and limited
          to what is necessary in relation to your purpose of use, following the
          principle of data minimisation of the EU's General Data Protection
          Regulation (Article 5(1(c))). The health data access body evaluates
          carefully if your requirements are in line with the GDPR data
          minimisation principle.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("section6")}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === "section6"
              ? "border-b-2 border-primary text-primary bg-primary/5"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span className="inline-block mr-2">Section 6</span>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-primary/20 text-primary">
            ✓
          </span>
          <span className="ml-1 text-xs">2/2</span>
        </button>
        <button
          onClick={() => setActiveTab("section6.1")}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === "section6.1"
              ? "border-b-2 border-primary text-primary bg-primary/5"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span className="inline-block mr-2">Section 6.1</span>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-warning text-black">
            ✓
          </span>
          <span className="ml-1 text-xs">24/24</span>
        </button>
      </div>

      {/* Section 6 Tab Content */}
      {activeTab === "section6" && (
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-gray-900">
            Description of the data needed: Netherlands
          </h3>

          {/* To which health data access body */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              To which health data access body do you want to submit the
              application?
            </label>
            <input
              type="text"
              defaultValue="European Health Data Agency"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Respective Dataset Record(s) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Respective Dataset Record(s) and Distributions
            </label>
            <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-surface">
              <span className="text-sm text-gray-700">
                Linking of registers for COVID-19 vaccine surveillance
              </span>
              <button className="text-primary hover:text-secondary">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>

          {/* Contact person */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              If you have been in contact with someone from the health data
              access body regarding the data you seek, list here the names and
              the e-mail addresses of this person
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Data linkage */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              How will the data for one person from different sources be linked?
              E.g. based on personal identification code. If some kind of other
              linkage method is used, describe that here{" "}
              <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      )}

      {/* Section 6.1 Tab Content */}
      {activeTab === "section6.1" && (
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-gray-900">
            Defining the extraction criteria for the cohort: Netherlands
          </h3>

          {/* Cohort size */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Indicate the size of the cohort{" "}
              <span className="text-red-600">*</span>
              <span className="font-normal text-gray-500 ml-2">(2/30)</span>
            </label>
            <textarea
              rows={2}
              value={cohortSize}
              onChange={(e) => setCohortSize(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <div className="space-y-2 mt-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="estimation"
                  name="cohortSizeType"
                  value="estimation"
                  checked={cohortSizeType === "estimation"}
                  onChange={(e) => setCohortSizeType(e.target.value)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="estimation" className="text-sm text-gray-700">
                  This is an estimation of the size of the cohort.
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="exact"
                  name="cohortSizeType"
                  value="exact"
                  checked={cohortSizeType === "exact"}
                  onChange={(e) => setCohortSizeType(e.target.value)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="exact" className="text-sm text-gray-700">
                  This is the exact size of the cohort.
                </label>
              </div>
            </div>
          </div>

          {/* Why cohort size */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Why do you need a cohort of this size for your project?{" "}
              <span className="text-red-600">*</span>
              <span className="font-normal text-gray-500 ml-2">(6/3280)</span>
            </label>
            <textarea
              rows={4}
              defaultValue="Reason"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Data sources */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              From which data holder(s) will the data be extracted?
            </label>
            <input
              type="text"
              defaultValue="Scoresisms"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Databases */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              From which databases/registries/registries will the data be
              extracted?
            </label>
            <p className="text-sm text-gray-600 mb-2">
              The data for the LINK-VACCs project is sourced from several
              existing databases, including Vaccinet+, HealthCare COVID-19
              database (Contact tracing and Clinic database), CurRNA, STATBELL,
              and the AIM database. These databases collectively provide
              comprehensive demographic and clinical data relevant to the
              project's objectives
            </p>
          </div>

          {/* Dataset records */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              From which dataset records/registries(s) will the data be
              extracted?
            </label>
            <input
              type="text"
              defaultValue="Linking of registers for COVID-19 vaccine surveillance"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Metadata */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              If the information is available, attach the list of the variables
              to be used in the data extraction. Use the format provided in the
              metadata catalogue.
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Only pdf, doc, docx, xls, xlsx, odt files. Maximum size is 5 MB.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm text-gray-700">
                HDEU - Health Data EU - DAMs Analysis.xf
              </span>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-gray-600">
                  📎
                </button>
                <button className="text-gray-400 hover:text-gray-600">↓</button>
              </div>
            </div>
            <button className="mt-3 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
              Add Files
            </button>
          </div>

          {/* Time period */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              For which time period(s) will the datasets records be extracted?{" "}
              <span className="text-red-600">*</span>
              <span className="font-normal text-gray-500 ml-2">(6/350)</span>
            </label>
            <input
              type="text"
              defaultValue="AAAAAA"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Extraction method */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Extraction method <span className="text-red-600">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="random-sample"
                  name="extractionMethod"
                  value="random-sample"
                  checked={extractionMethod === "random-sample"}
                  onChange={(e) => setExtractionMethod(e.target.value)}
                  className="mr-2 h-4 w-4"
                />
                <label
                  htmlFor="random-sample"
                  className="text-sm text-gray-700"
                >
                  random sample
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-people"
                  name="extractionMethod"
                  value="all-people"
                  checked={extractionMethod === "all-people"}
                  onChange={(e) => setExtractionMethod(e.target.value)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="all-people" className="text-sm text-gray-700">
                  all the people fulfilling the criteria
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="other-sample"
                  name="extractionMethod"
                  value="other-sample"
                  checked={extractionMethod === "other-sample"}
                  onChange={(e) => setExtractionMethod(e.target.value)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="other-sample" className="text-sm text-gray-700">
                  other sample
                </label>
              </div>
            </div>
          </div>

          {/* Sample size */}
          {extractionMethod === "random-sample" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sample size <span className="text-red-600">*</span>
                <span className="font-normal text-gray-500 ml-2">(5/32)</span>
              </label>
              <input
                type="text"
                defaultValue="10001"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          )}

          {/* Inclusion criteria */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Describe the Inclusion criteria for cohort extraction{" "}
              <span className="text-red-600">*</span>
              <span className="font-normal text-gray-500 ml-2">(11/20000)</span>
            </label>
            <p className="text-xs text-gray-600 mb-2">
              In case of age-specific criteria for cohort extraction, please
              specify the age (e.g., only age 18 and older or anyone in a
              specific age range). If something is unclear on which point
              variables should be calculated and at which time point
            </p>
            <textarea
              rows={4}
              defaultValue="Description"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Exclusion criteria */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Describe the potential exclusion criteria for cohort extraction{" "}
              <span className="text-red-600">*</span>
              <span className="font-normal text-gray-500 ml-2">(11/20000)</span>
            </label>
            <textarea
              rows={4}
              defaultValue="Description"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Tabulation plan array */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tabulation plan array <span className="text-red-600">*</span>
              <span className="font-normal text-gray-500 ml-2">(29/1800)</span>
            </label>
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-gray-500 text-xs flex-shrink-0"
              />
              <span className="text-xs italic text-gray-600">
                In addition, write down the following information for each data
                dimension Negative is to small Positive cohort Affiliation on
                the dimension variables of interest Where they should be
                stranded Information on other relevant factors related to
                generating the required table(s)
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Register to be used"
                  defaultValue="Asd"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Possible cohort"
                  defaultValue="Asd"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Tabulation plans */}
            {tabulationPlans.map((plan) => (
              <div
                key={plan.id}
                className="mb-4 p-4 border border-gray-200 rounded-lg bg-surface"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Tabulation Plan {plan.id}
                  </h4>
                  {tabulationPlans.length > 1 && (
                    <button
                      onClick={() => removeTabulationPlan(plan.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-900 mb-1 block">
                      Information on the required variables (if available){" "}
                      <span className="text-red-600">*</span>
                      <span className="font-normal text-gray-500">
                        (2/1000)
                      </span>
                    </label>
                    <input
                      type="text"
                      defaultValue="t2"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 mb-1 block">
                      Formation of variables where they cannot be directly
                      accessed from the database{" "}
                      <span className="text-red-600">*</span>
                      <span className="font-normal text-gray-500">
                        (2/1000)
                      </span>
                    </label>
                    <input
                      type="text"
                      defaultValue="t2"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 mb-1 block">
                      Desired direction of aggregation of percentages{" "}
                      <span className="text-red-600">*</span>
                      <span className="font-normal text-gray-500">
                        (2/1000)
                      </span>
                    </label>
                    <input
                      type="text"
                      defaultValue="t2"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 mb-1 block">
                      Order in which tables are generated when previously
                      generated tables are used to create other tables{" "}
                      <span className="text-red-600">*</span>
                      <span className="font-normal text-gray-500">(1000)</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="t2"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 mb-1 block">
                      Any other relevant factors related to generating the
                      required tables(s) <span className="text-red-600">*</span>
                      <span className="font-normal text-gray-500">
                        (2/1000)
                      </span>
                    </label>
                    <input
                      type="text"
                      defaultValue="t2"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Tabulation Plan file upload */}
                  <div>
                    <label className="text-xs font-semibold text-gray-900 mb-1 block">
                      Tabulation Plan - Attach an excel file or equivalent
                      table. <span className="text-red-600">*</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                      Only pdf, doc, docx, xls, xlsx, odt files. Maximum size is
                      5 MB.
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">
                        HDEU - Health Data EU - DAMs Analysis.xf
                      </span>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          📎
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          ↓
                        </button>
                      </div>
                    </div>
                    <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
                      Select File
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add tabulation plan button */}
          <button
            onClick={addTabulationPlan}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add tabulation plan</span>
          </button>

          {/* Extraction description and compilation of statistics */}
          <div className="bg-surface rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Extraction description and compilation of statistics
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              A health data access body shall only provide the data you request
              only in an anonymised statistical format, if your data request is
              accepted. Due to anonymity, the data user shall have no access to
              the electronic health data used to provide this answer. All the
              information you request must be rendered down to a general level
              in order to avoid small cell counts with high re-identification
              potential.
            </p>
          </div>

          {/* How often does the data need to be extracted */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              How often does the data need to be extracted?{" "}
              <span className="text-red-600">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="once"
                  name="extractionFrequency"
                  value="once"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="once" className="text-sm text-gray-700">
                  Once
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="multiple"
                  name="extractionFrequency"
                  value="multiple"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="multiple" className="text-sm text-gray-700">
                  Multiple times
                </label>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white">
                ✕
              </span>
              <span>This field is required.</span>
            </div>
          </div>

          {/* Provide more information on the extracting periods/times */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Provide more information on the extracting periods/times{" "}
              <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-gray-500 text-xs"
              />
              <span className="text-xs italic text-gray-600">
                If you want the data to be extracted multiple times over a
                certain period of time, note that the definitions and the data
                gathering method may change during the review period in some
                cases.
              </span>
            </div>
            <textarea
              rows={4}
              className="w-full border border-red-600 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white">
                ✕
              </span>
              <span>This field is required.</span>
            </div>
          </div>

          {/* Do you intend to make use of an exception */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Do you intend to make use of an exception to the right to opt out
              according to the mechanism provided in the national law of the
              member state whose data you are applying for?{" "}
              <span className="text-red-600">*</span>
            </label>
            <div className="flex items-start gap-2 mb-3">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-gray-500 text-xs mt-1 flex-shrink-0"
              />
              <span className="text-xs italic text-gray-600">
                EHDS article 71(4) "By way of exception from the right to opt
                out provided for in paragraph 1, a Member State may provide in
                its national law for a mechanism by which a right to opt out has
                been exercised available, provided that all the following
                conditions are fulfilled: (refer to the article for full
                conditions)"
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="opt-out-yes"
                  name="optOutException"
                  value="yes"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="opt-out-yes" className="text-sm text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="opt-out-no"
                  name="optOutException"
                  value="no"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="opt-out-no" className="text-sm text-gray-700">
                  No
                </label>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white">
                ✕
              </span>
              <span>This field is required.</span>
            </div>
          </div>
        </div>
      )}

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

export default Section6;
