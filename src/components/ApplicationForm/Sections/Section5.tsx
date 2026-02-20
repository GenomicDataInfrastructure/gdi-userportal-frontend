// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { UpdateApplicationSection5Request } from "@/app/api/access-management-v1";
import { SectionProps } from "../ApplicationFormContent";

const Section5: React.FC<SectionProps> = ({
  applicationData,
  sectionDataRef,
}) => {
  // Responsible person fields
  const [
    personResponsibleSameAsContactPerson,
    setPersonResponsibleSameAsContactPerson,
  ] = useState<boolean>(false);
  const [personResponsibleName, setPersonResponsibleName] =
    useState<string>("");

  // Research person fields
  const [
    personResearchSameAsContactPerson,
    setPersonResearchSameAsContactPerson,
  ] = useState<boolean>(false);
  const [personResearchName, setPersonResearchName] = useState<string>("");

  // Project details fields
  const [whyAreTheDataRequested, setWhyAreTheDataRequested] =
    useState<string>("");
  const [
    whatIsTheAimAndTopicOfTheProject,
    setWhatIsTheAimAndTopicOfTheProject,
  ] = useState<string>("");
  const [whichAreTheExpectedBenefits, setWhichAreTheExpectedBenefits] =
    useState<string>("");
  const [describeApplicantsQualification, setDescribeApplicantsQualification] =
    useState<string>("");

  // Legal basis fields
  const [legalBasis, setLegalBasis] = useState<string>("");
  const [linkToTheSupportingLegalBasis, setLinkToTheSupportingLegalBasis] =
    useState<string>("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation function
  const validateField = (fieldName: string, value: string): string => {
    console.log(`validating ${fieldName} and value ${value}`);
    switch (fieldName) {
      case "personResponsibleName":
        if (!personResponsibleSameAsContactPerson && !value.trim()) {
          return "Person responsible name is required";
        }
        return "";
      case "whyAreTheDataRequested":
        if (!value.trim()) {
          return "This field is required";
        }
        return "";
      case "whatIsTheAimAndTopicOfTheProject":
        if (!value.trim()) {
          return "This field is required";
        }
        return "";
      case "whichAreTheExpectedBenefits":
        if (!value.trim()) {
          return "This field is required";
        }
        return "";
      case "describeApplicantsQualification":
        if (!value.trim()) {
          return "This field is required";
        }
        return "";
      case "legalBasis":
        if (!value.trim()) {
          return "This field is required";
        }
        return "";
      case "linkToTheSupportingLegalBasis":
        if (!value.trim()) {
          return "This field is required";
        }
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Initialize from applicationData
  useEffect(() => {
    if (applicationData?.form?.section5) {
      console.log(
        "📋 Section5 Data from applicationData:",
        applicationData.form.section5
      );

      setPersonResponsibleSameAsContactPerson(
        applicationData.form.section5.personResponsibleSameAsContactPerson ??
          false
      );
      setPersonResponsibleName(
        applicationData.form.section5.personResponsibleName ?? ""
      );
      setPersonResearchSameAsContactPerson(
        applicationData.form.section5.personResearchSameAsContactPerson ?? false
      );
      setPersonResearchName(
        applicationData.form.section5.personResearchName ?? ""
      );
      setWhyAreTheDataRequested(
        applicationData.form.section5.whyAreTheDataRequested ?? ""
      );
      setWhatIsTheAimAndTopicOfTheProject(
        applicationData.form.section5.whatIsTheAimAndTopicOfTheProject ?? ""
      );
      setWhichAreTheExpectedBenefits(
        applicationData.form.section5.whichAreTheExpectedBenefits ?? ""
      );
      setDescribeApplicantsQualification(
        applicationData.form.section5.describeApplicantsQualification ?? ""
      );
      setLegalBasis(applicationData.form.section5.legalBasis ?? "");
      setLinkToTheSupportingLegalBasis(
        applicationData.form.section5.linkToTheSupportingLegalBasis ?? ""
      );
    } else {
      console.log("⚠️ No section5 data found in applicationData");
    }
  }, [applicationData?.form?.section5]);

  // Update sectionDataRef whenever data changes
  useEffect(() => {
    if (sectionDataRef) {
      const section5Data: UpdateApplicationSection5Request = {
        sectionNumber: 5,
        personResponsibleSameAsContactPerson,
        personResponsibleName,
        personResearchSameAsContactPerson,
        personResearchName,
        whyAreTheDataRequested,
        whatIsTheAimAndTopicOfTheProject,
        whichAreTheExpectedBenefits,
        describeApplicantsQualification,
        legalBasis,
        linkToTheSupportingLegalBasis,
      };
      console.log("📝 Updated Section5 Data:", section5Data);
      sectionDataRef.current = section5Data;
    }

    // Update validation errors
    const newErrors: Record<string, string> = {};
    newErrors.personResponsibleName = validateField(
      "personResponsibleName",
      personResponsibleName
    );
    newErrors.whyAreTheDataRequested = validateField(
      "whyAreTheDataRequested",
      whyAreTheDataRequested
    );
    newErrors.whatIsTheAimAndTopicOfTheProject = validateField(
      "whatIsTheAimAndTopicOfTheProject",
      whatIsTheAimAndTopicOfTheProject
    );
    newErrors.whichAreTheExpectedBenefits = validateField(
      "whichAreTheExpectedBenefits",
      whichAreTheExpectedBenefits
    );
    newErrors.describeApplicantsQualification = validateField(
      "describeApplicantsQualification",
      describeApplicantsQualification
    );
    newErrors.legalBasis = validateField("legalBasis", legalBasis);
    newErrors.linkToTheSupportingLegalBasis = validateField(
      "linkToTheSupportingLegalBasis",
      linkToTheSupportingLegalBasis
    );
    setErrors(newErrors);
  }, [
    sectionDataRef,
    personResponsibleSameAsContactPerson,
    personResponsibleName,
    personResearchSameAsContactPerson,
    personResearchName,
    whyAreTheDataRequested,
    whatIsTheAimAndTopicOfTheProject,
    whichAreTheExpectedBenefits,
    describeApplicantsQualification,
    legalBasis,
    linkToTheSupportingLegalBasis,
  ]);

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

      {/* Purpose of data use section - READ ONLY from Section 2 */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Purpose of data use (from Section 2)
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex items-start">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="mr-2 text-blue-500 mt-0.5 flex-shrink-0"
          />
          The purposes selected in Section 2 are displayed below. To change
          these, please go back to Section 2.
        </p>

        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {applicationData?.form?.section2?.purposeForWhichDataWillBeUsed &&
          applicationData.form.section2.purposeForWhichDataWillBeUsed.length >
            0 ? (
            applicationData.form.section2.purposeForWhichDataWillBeUsed.map(
              (purpose, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="mr-3 text-primary">✓</span>
                  <span className="text-sm text-gray-700">{purpose.value}</span>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-gray-500 italic">
              No purposes selected in Section 2
            </p>
          )}
        </div>
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
            checked={personResponsibleSameAsContactPerson}
            onChange={(e) => {
              setPersonResponsibleSameAsContactPerson(e.target.checked);
              if (
                e.target.checked &&
                applicationData?.form?.section3?.contactPersonName
              ) {
                setPersonResponsibleName(
                  applicationData.form.section3.contactPersonName
                );
              }
            }}
            className="mt-1 mr-3 h-4 w-4"
          />
          <label htmlFor="same-contact-data" className="text-sm text-gray-700">
            Same as contact person mentioned in section 3 (Applicant and contact
            person information)?
          </label>
        </div>

        {!personResponsibleSameAsContactPerson && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={personResponsibleName}
              onChange={(e) => setPersonResponsibleName(e.target.value)}
              onBlur={() => handleBlur("personResponsibleName")}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary ${
                touched.personResponsibleName && errors.personResponsibleName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary"
              }`}
            />
            {touched.personResponsibleName && errors.personResponsibleName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.personResponsibleName}
              </p>
            )}
          </div>
        )}
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
            checked={personResearchSameAsContactPerson}
            onChange={(e) => {
              setPersonResearchSameAsContactPerson(e.target.checked);
              if (
                e.target.checked &&
                applicationData?.form?.section3?.contactPersonName
              ) {
                setPersonResearchName(
                  applicationData.form.section3.contactPersonName
                );
              }
            }}
            className="mt-1 mr-3 h-4 w-4"
          />
          <label
            htmlFor="same-contact-research"
            className="text-sm text-gray-700"
          >
            Same as contact person mentioned in section 3 (Applicant and contact
            person information)?
          </label>
        </div>

        {!personResearchSameAsContactPerson && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full name
            </label>
            <input
              type="text"
              value={personResearchName}
              onChange={(e) => setPersonResearchName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        )}
      </div>

      {/* Why are the data requested */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Why are the data requested with this application needed for the
          indicated purpose of use? <span className="text-red-600">*</span>
        </label>
        <textarea
          rows={4}
          value={whyAreTheDataRequested}
          onChange={(e) => setWhyAreTheDataRequested(e.target.value)}
          onBlur={() => handleBlur("whyAreTheDataRequested")}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 ${
            touched.whyAreTheDataRequested && errors.whyAreTheDataRequested
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary focus:border-primary"
          }`}
        />
        {touched.whyAreTheDataRequested && errors.whyAreTheDataRequested && (
          <p className="mt-1 text-sm text-red-600">
            {errors.whyAreTheDataRequested}
          </p>
        )}
      </div>

      {/* Aim and topic of project */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          What is the aim and topic of your project?{" "}
          <span className="text-red-600">*</span>
        </label>
        <textarea
          rows={4}
          value={whatIsTheAimAndTopicOfTheProject}
          onChange={(e) => setWhatIsTheAimAndTopicOfTheProject(e.target.value)}
          onBlur={() => handleBlur("whatIsTheAimAndTopicOfTheProject")}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 ${
            touched.whatIsTheAimAndTopicOfTheProject &&
            errors.whatIsTheAimAndTopicOfTheProject
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary focus:border-primary"
          }`}
        />
        {touched.whatIsTheAimAndTopicOfTheProject &&
          errors.whatIsTheAimAndTopicOfTheProject && (
            <p className="mt-1 text-sm text-red-600">
              {errors.whatIsTheAimAndTopicOfTheProject}
            </p>
          )}
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
          value={whichAreTheExpectedBenefits}
          onChange={(e) => setWhichAreTheExpectedBenefits(e.target.value)}
          onBlur={() => handleBlur("whichAreTheExpectedBenefits")}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 ${
            touched.whichAreTheExpectedBenefits &&
            errors.whichAreTheExpectedBenefits
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary focus:border-primary"
          }`}
        />
        {touched.whichAreTheExpectedBenefits &&
          errors.whichAreTheExpectedBenefits && (
            <p className="mt-1 text-sm text-red-600">
              {errors.whichAreTheExpectedBenefits}
            </p>
          )}
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
          value={describeApplicantsQualification}
          onChange={(e) => setDescribeApplicantsQualification(e.target.value)}
          onBlur={() => handleBlur("describeApplicantsQualification")}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 ${
            touched.describeApplicantsQualification &&
            errors.describeApplicantsQualification
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary focus:border-primary"
          }`}
        />
        {touched.describeApplicantsQualification &&
          errors.describeApplicantsQualification && (
            <p className="mt-1 text-sm text-red-600">
              {errors.describeApplicantsQualification}
            </p>
          )}
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
          value={legalBasis}
          onChange={(e) => setLegalBasis(e.target.value)}
          onBlur={() => handleBlur("legalBasis")}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 ${
            touched.legalBasis && errors.legalBasis
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary focus:border-primary"
          }`}
        />
        {touched.legalBasis && errors.legalBasis && (
          <p className="mt-1 text-sm text-red-600">{errors.legalBasis}</p>
        )}
      </div>

      {/* Link to supporting documentation */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Provide a link to the supporting documentation as evidence of the
          legal basis <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={linkToTheSupportingLegalBasis}
          onChange={(e) => setLinkToTheSupportingLegalBasis(e.target.value)}
          onBlur={() => handleBlur("linkToTheSupportingLegalBasis")}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 ${
            touched.linkToTheSupportingLegalBasis &&
            errors.linkToTheSupportingLegalBasis
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary focus:border-primary"
          }`}
        />
        {touched.linkToTheSupportingLegalBasis &&
          errors.linkToTheSupportingLegalBasis && (
            <p className="mt-1 text-sm text-red-600">
              {errors.linkToTheSupportingLegalBasis}
            </p>
          )}
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

// Export validation function for use in parent component
export const validateSection5Data = (
  data: UpdateApplicationSection5Request
): string[] => {
  const missingFields: string[] = [];

  if (
    !data.personResponsibleSameAsContactPerson &&
    !data.personResponsibleName?.trim()
  ) {
    missingFields.push("Person responsible name");
  }
  if (!data.whyAreTheDataRequested?.trim()) {
    missingFields.push("Reason");
  }
  if (!data.whatIsTheAimAndTopicOfTheProject?.trim()) {
    missingFields.push("Aim and topic of the project");
  }
  if (!data.whichAreTheExpectedBenefits?.trim()) {
    missingFields.push("Expected benefits");
  }
  if (!data.describeApplicantsQualification?.trim()) {
    missingFields.push("Applicant qualifications");
  }
  if (!data.legalBasis?.trim()) {
    missingFields.push("Legal basis");
  }
  if (!data.linkToTheSupportingLegalBasis?.trim()) {
    missingFields.push("Link to supporting documentation");
  }

  return missingFields;
};

export default Section5;
