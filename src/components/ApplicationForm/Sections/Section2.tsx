// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { UpdateApplicationSection2Request } from "@/app/api/access-management-v1";
import { SectionProps } from "../ApplicationFormContent";

const Section2: React.FC<SectionProps> = ({
  applicationData,
  sectionDataRef,
}) => {
  const [showAllPurposes, setShowAllPurposes] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectLeader, setProjectLeader] = useState("");
  const [countryOfProjectLeader, setCountryOfProjectLeader] = useState<{
    key: string;
    value: string;
  } | null>(null);
  const [selectedPurposes, setSelectedPurposes] = useState<Set<string>>(
    new Set()
  );
  const [summaryOfTheProject, setSummaryOfTheProject] = useState("");
  const [noSummary, setNoSummary] = useState(false);
  const [noSummaryReason, setNoSummaryReason] = useState("");

  const purposeList = [
    {
      key: "a",
      value:
        "a. The public interest in the areas of public or occupational health, such as activities to protect against serious cross-border threats to health, public health surveillance or activities ensuring high levels of quality and safety of healthcare, including patient safety, and of medicinal products or medical devices.",
    },
    {
      key: "b",
      value:
        "b. Policy making and regulatory activities to support public sector bodies or Union institutions, bodies, offices and agencies, including regulatory authorities, in the health or care sector to carry out their tasks defined in their mandates.",
    },
    {
      key: "c",
      value:
        "c. Statistics as defined in Article 3, point (1), of Regulation (EU) No 223/2009, such as national, multi-national and Union level official statistics, related to health or care sectors.",
    },
    {
      key: "d",
      value:
        "d. Education or teaching activities in health or care sectors at vocational or higher education level.",
    },
    {
      key: "e",
      value:
        "e. Scientific research related to health or care sectors that contributes to public health or health technology assessment, or ensures high levels of quality and safety of healthcare, of medicinal products or of medical devices, with the aim of benefitting end-users, such as patients, health professionals and health administrators, including:\n(i) development and innovation activities for products or services;\n(ii) training, testing and evaluation of algorithms, including in medical devices, in vitro diagnostic medical devices, AI systems and digital health applications.",
    },
  ];

  const countries = [
    {
      key: "http://publications.europa.eu/resource/authority/country/NLD",
      value: "Netherlands",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/DEU",
      value: "Germany",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/FRA",
      value: "France",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/ESP",
      value: "Spain",
    },
  ];

  // Initialize form data from applicationData
  useEffect(() => {
    if (applicationData?.form?.section2) {
      const section2 = applicationData.form.section2;
      setProjectName(section2.projectName ?? "");
      setProjectLeader(section2.projectLeader ?? "");
      setCountryOfProjectLeader(section2.countryOfProjectLeader ?? null);

      if (section2.purposeForWhichDataWillBeUsed) {
        const purposeKeys = new Set(
          section2.purposeForWhichDataWillBeUsed.map((p) => p.key)
        );
        setSelectedPurposes(purposeKeys);
      }

      setSummaryOfTheProject(section2.summaryOfTheProject ?? "");
      setNoSummary(
        section2.theNatureOfTheProjectDoesNotLetYouProvideASummary ?? false
      );
      setNoSummaryReason(
        section2.theNatureOfTheProjectDoesNotLetYouProvideASummaryReason ?? ""
      );
    }
  }, [applicationData?.form?.section2]);

  // Update sectionDataRef when form data changes
  useEffect(() => {
    if (sectionDataRef) {
      const section2Data: UpdateApplicationSection2Request = {
        sectionNumber: 2,
        projectName,
        projectLeader,
        countryOfProjectLeader: countryOfProjectLeader ?? {
          key: "",
          value: "",
        },
        purposeForWhichDataWillBeUsed: Array.from(selectedPurposes).map(
          (key) => {
            const purpose = purposeList.find((p) => p.key === key);
            return { key, value: purpose?.value ?? "" };
          }
        ),
        summaryOfTheProject: noSummary ? undefined : summaryOfTheProject,
        theNatureOfTheProjectDoesNotLetYouProvideASummary: noSummary,
        theNatureOfTheProjectDoesNotLetYouProvideASummaryReason: noSummary
          ? noSummaryReason
          : undefined,
      };
      sectionDataRef.current = section2Data;
    }
  }, [
    sectionDataRef,
    projectName,
    projectLeader,
    countryOfProjectLeader,
    selectedPurposes,
    summaryOfTheProject,
    noSummary,
    noSummaryReason,
  ]);

  const handlePurposeToggle = (key: string) => {
    const newPurposes = new Set(selectedPurposes);
    if (newPurposes.has(key)) {
      newPurposes.delete(key);
    } else {
      newPurposes.add(key);
    }
    setSelectedPurposes(newPurposes);
  };

  const purposes = purposeList.map((p) => p.value);

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
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
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
          value={projectLeader}
          onChange={(e) => setProjectLeader(e.target.value)}
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
          <select
            value={countryOfProjectLeader?.key ?? ""}
            onChange={(e) => {
              const country = countries.find((c) => c.key === e.target.value);
              setCountryOfProjectLeader(country ?? null);
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.key} value={country.key}>
                {country.value}
              </option>
            ))}
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
            .map((purpose, index) => {
              const purposeKey = purposeList[index]?.key;
              return (
                <div key={index} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`purpose-${index}`}
                    checked={selectedPurposes.has(purposeKey)}
                    onChange={() => handlePurposeToggle(purposeKey)}
                    className="mt-1 mr-3 h-4 w-4"
                  />
                  <label
                    htmlFor={`purpose-${index}`}
                    className="text-sm text-gray-700 leading-relaxed"
                  >
                    {purpose}
                  </label>
                </div>
              );
            })}
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
          value={summaryOfTheProject}
          onChange={(e) => setSummaryOfTheProject(e.target.value)}
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
        {noSummary && (
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Please explain why you cannot provide a summary *
            </label>
            <textarea
              rows={3}
              value={noSummaryReason}
              onChange={(e) => setNoSummaryReason(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Explain the reason..."
            />
          </div>
        )}
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
