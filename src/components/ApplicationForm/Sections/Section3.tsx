// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { UpdateApplicationSection3Request } from "@/app/api/access-management-v1";
import { SectionProps } from "../ApplicationFormContent";

const Section3: React.FC<SectionProps> = ({
  applicationData,
  sectionDataRef,
}) => {
  const [publicSectorBody, setPublicSectorBody] = useState<string>("");
  const [mandateTasks, setMandateTasks] = useState<string>("");
  const [applicantType, setApplicantType] = useState<string>("natural");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonEmail, setContactPersonEmail] = useState("");
  const [contactPersonPhone, setContactPersonPhone] = useState({
    countryCode: "",
    number: "",
    isoCode: "",
  });
  const [contactPersonOrganisationName, setContactPersonOrganisationName] =
    useState("");
  const [contactPersonBusinessID, setContactPersonBusinessID] = useState("");
  const [contactPersonRelationship, setContactPersonRelationship] =
    useState("");
  const [naturalPersonName, setNaturalPersonName] = useState("");
  const [naturalPersonAddress, setNaturalPersonAddress] = useState("");
  const [naturalPersonZipCode, setNaturalPersonZipCode] = useState("");
  const [naturalPersonCity, setNaturalPersonCity] = useState("");
  const [naturalPersonCountry, setNaturalPersonCountry] = useState<{
    key: string;
    value: string;
  } | null>(null);
  const [naturalPersonEmail, setNaturalPersonEmail] = useState("");
  const [naturalPersonPhone, setNaturalPersonPhone] = useState({
    countryCode: "",
    number: "",
    isoCode: "",
  });
  const [naturalPersonJobTitle, setNaturalPersonJobTitle] = useState("");
  const [naturalPersonAffiliation, setNaturalPersonAffiliation] =
    useState("");
  const [legalPersonName, setLegalPersonName] = useState("");
  const [legalPersonAddress, setLegalPersonAddress] = useState("");
  const [legalPersonZipCode, setLegalPersonZipCode] = useState("");
  const [legalPersonCity, setLegalPersonCity] = useState("");
  const [legalPersonCountry, setLegalPersonCountry] = useState<{
    key: string;
    value: string;
  } | null>(null);

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
    {
      key: "http://publications.europa.eu/resource/authority/country/LUX",
      value: "Luxembourg",
    },
  ];

  // Initialize form data from applicationData
  useEffect(() => {
    if (applicationData?.form?.section3) {
      const section3 = applicationData.form.section3;
      // Map enum keys: "a" = yes/legal, "b" = no/natural
      const publicSectorKey = section3.applyingForDataOnBehalfOfPublicSector?.key ?? "";
      setPublicSectorBody(publicSectorKey === "a" ? "yes" : publicSectorKey === "b" ? "no" : "");
      
      const mandateTasksKey = section3.applyingForDataForCarryingOutTasks?.key ?? "";
      setMandateTasks(mandateTasksKey === "a" ? "yes" : mandateTasksKey === "b" ? "no" : "");
      
      const applicantTypeKey = section3.legalOrNaturalPerson?.key ?? "b";
      setApplicantType(applicantTypeKey === "a" ? "legal" : "natural");
      
      setContactPersonName(section3.contactPersonName ?? "");
      setContactPersonEmail(section3.contactPersonEmail ?? "");
      setContactPersonPhone(
        section3.contactPersonPhone ?? {
          countryCode: "",
          number: "",
          isoCode: "",
        }
      );
      setContactPersonOrganisationName(
        section3.contactPersonOrganisationName ?? ""
      );
      setContactPersonBusinessID(section3.contactPersonBusinessID ?? "");
      setContactPersonRelationship(section3.contactPersonRelationship ?? "");
      setNaturalPersonName(section3.naturalPersonName ?? "");
      setNaturalPersonAddress(section3.naturalPersonAddress ?? "");
      setNaturalPersonZipCode(section3.naturalPersonZipCode ?? "");
      setNaturalPersonCity(section3.naturalPersonCity ?? "");
      setNaturalPersonCountry(section3.naturalPersonCountry ?? null);
      setNaturalPersonEmail(section3.naturalPersonEmail ?? "");
      setNaturalPersonPhone(
        section3.naturalPersonPhone ?? {
          countryCode: "",
          number: "",
          isoCode: "",
        }
      );
      setNaturalPersonJobTitle(section3.naturalPersonJobTitle ?? "");
      setNaturalPersonAffiliation(section3.naturalPersonAffiliation ?? "");
      setLegalPersonName(section3.legalPersonName ?? "");
      setLegalPersonAddress(section3.legalPersonAddress ?? "");
      setLegalPersonZipCode(section3.legalPersonZipCode ?? "");
      setLegalPersonCity(section3.legalPersonCity ?? "");
      setLegalPersonCountry(section3.legalPersonCountry ?? null);
    }
  }, [applicationData?.form?.section3]);

  // Update sectionDataRef when form data changes
  useEffect(() => {
    if (sectionDataRef) {
      const section3Data: UpdateApplicationSection3Request = {
        sectionNumber: 3,
        legalOrNaturalPerson: {
          key: applicantType === "legal" ? "a" : "b",
          value: applicantType === "legal" ? "Legal person" : "Natural person",
        },
        applyingForDataOnBehalfOfPublicSector: {
          key: publicSectorBody === "yes" ? "a" : "b",
          value: publicSectorBody === "yes" ? "Yes" : "No",
        },
        applyingForDataForCarryingOutTasks: publicSectorBody === "yes" ? null : {
          key: mandateTasks === "yes" ? "a" : "b",
          value: mandateTasks === "yes" ? "Yes" : "No",
        },
        contactPersonName,
        contactPersonEmail,
        contactPersonPhone,
        contactPersonOrganisationName,
        contactPersonBusinessID,
        contactPersonRelationship,
        naturalPersonName,
        naturalPersonAddress,
        naturalPersonZipCode,
        naturalPersonCity,
        naturalPersonCountry: naturalPersonCountry ?? { key: "", value: "" },
        naturalPersonEmail,
        naturalPersonPhone,
        naturalPersonJobTitle,
        naturalPersonAffiliation,
        legalPersonName,
        legalPersonAddress,
        legalPersonZipCode,
        legalPersonCity,
        legalPersonCountry: legalPersonCountry ?? { key: "", value: "" },
      };
      sectionDataRef.current = section3Data;
    }
  }, [
    sectionDataRef,
    publicSectorBody,
    mandateTasks,
    applicantType,
    contactPersonName,
    contactPersonEmail,
    contactPersonPhone,
    contactPersonOrganisationName,
    contactPersonBusinessID,
    contactPersonRelationship,
    naturalPersonName,
    naturalPersonAddress,
    naturalPersonZipCode,
    naturalPersonCity,
    naturalPersonCountry,
    naturalPersonEmail,
    naturalPersonPhone,
    naturalPersonJobTitle,
    naturalPersonAffiliation,
    legalPersonName,
    legalPersonAddress,
    legalPersonZipCode,
    legalPersonCity,
    legalPersonCountry,
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
          A data request application should state the name and contact details
          of the applicant, either a legal or a natural person. Information on
          the contact person responding to any inquiries related to the
          application, e.g. by the HDAB (in the case of a natural person
          applying on behalf of or another person, should also be included. If
          the contact person is not the same person as the applicant, their
          relationship, e.g. based on an employment contract, should be
          clarified.
        </p>
      </div>

      {/* Question 1: Public sector body */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Are you applying for data on behalf of a public sector body or a
          European Union institution, body, office or agency?{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="public-yes"
              name="publicSectorBody"
              value="yes"
              checked={publicSectorBody === "yes"}
              onChange={(e) => setPublicSectorBody(e.target.value)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="public-yes" className="text-sm text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="public-no"
              name="publicSectorBody"
              value="no"
              checked={publicSectorBody === "no"}
              onChange={(e) => setPublicSectorBody(e.target.value)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="public-no" className="text-sm text-gray-700">
              No
            </label>
          </div>
        </div>
      </div>

      {/* Question 2: Mandate tasks */}
      {publicSectorBody === "yes" && (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Are you applying for data for carrying out tasks enshrined in the
          mandate of your organisation/institution?{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            Tasks in your organization's/institution's mandate mean tasks based
            on national or European Union law.
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="mandate-yes"
              name="mandateTasks"
              value="yes"
              checked={mandateTasks === "yes"}
              onChange={(e) => setMandateTasks(e.target.value)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="mandate-yes" className="text-sm text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="mandate-no"
              name="mandateTasks"
              value="no"
              checked={mandateTasks === "no"}
              onChange={(e) => setMandateTasks(e.target.value)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="mandate-no" className="text-sm text-gray-700">
              No
            </label>
          </div>
        </div>
      </div>)}

      {/* Fill from user profile button */}
      <div className="mb-8">
        <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
          <span>⇄</span>
          <span>Fill from user profile</span>
        </button>
      </div>

      {/* Question 3: Legal or Natural person */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Is the applicant a legal or a natural person?{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            Natural person = a physical person, an individual human being. Legal
            person = A company, organisation or an association.
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              type="radio"
              id="legal-person"
              name="applicantType"
              value="legal"
              checked={applicantType === "legal"}
              onChange={(e) => setApplicantType(e.target.value)}
              className="mt-1 mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="legal-person" className="text-sm text-gray-700">
              Legal person
            </label>
          </div>
          <div className="flex items-start">
            <input
              type="radio"
              id="natural-person"
              name="applicantType"
              value="natural"
              checked={applicantType === "natural"}
              onChange={(e) => setApplicantType(e.target.value)}
              className="mt-1 mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <div>
              <label htmlFor="natural-person" className="text-sm text-gray-700">
                Natural person
              </label>
              <p className="mt-1 text-xs italic text-gray-600">
                (If you choose this option, you confirm that you apply for data
                as a private person without any affiliation.)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Natural Person Form */}
      {applicantType === "natural" && (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Natural person
        </h3>

        {/* Full name */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Full name <span className="text-red-600">*</span>{" "}
            <span className="font-normal text-gray-500">(7/500)</span>
          </label>
          <input
            type="text"
            value={naturalPersonName}
            onChange={(e) => setNaturalPersonName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Postal Address Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Postal Address
          </h4>

          {/* Street name and number */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Street name and number <span className="text-red-600">*</span>{" "}
              <span className="font-normal text-gray-500">(12/2000)</span>
            </label>
            <textarea
              rows={3}
              value={naturalPersonAddress}
              onChange={(e) => setNaturalPersonAddress(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Zip Code */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Zip Code <span className="text-red-600">*</span>{" "}
              <span className="font-normal text-gray-500">(4/50)</span>
            </label>
            <input
              type="text"
              value={naturalPersonZipCode}
              onChange={(e) => setNaturalPersonZipCode(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* City/Town */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              City/Town <span className="text-red-600">*</span>{" "}
              <span className="font-normal text-gray-500">(11/300)</span>
            </label>
            <input
              type="text"
              value={naturalPersonCity}
              onChange={(e) => setNaturalPersonCity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Country <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <select
                value={naturalPersonCountry?.key ?? ""}
                onChange={(e) => {
                  const country = countries.find(
                    (c) => c.key === e.target.value
                  );
                  setNaturalPersonCountry(country ?? null);
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
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Email <span className="text-red-600">*</span>{" "}
            <span className="font-normal text-gray-500">(21/500)</span>
          </label>
          <input
            type="email"
            value={naturalPersonEmail}
            onChange={(e) => setNaturalPersonEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Phone <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Country Code"
              value={naturalPersonPhone.countryCode}
              onChange={(e) =>
                setNaturalPersonPhone({
                  ...naturalPersonPhone,
                  countryCode: e.target.value,
                })
              }
              className="w-16 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={naturalPersonPhone.number}
              onChange={(e) =>
                setNaturalPersonPhone({
                  ...naturalPersonPhone,
                  number: e.target.value,
                })
              }
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              placeholder="ISO Code"
              value={naturalPersonPhone.isoCode}
              onChange={(e) =>
                setNaturalPersonPhone({
                  ...naturalPersonPhone,
                  isoCode: e.target.value,
                })
              }
              className="w-16 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Job Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Job title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={naturalPersonJobTitle}
            onChange={(e) => setNaturalPersonJobTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Affiliation */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Affiliation <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={naturalPersonAffiliation}
            onChange={(e) => setNaturalPersonAffiliation(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      )}

      {/* Legal Person Form */}
      {applicantType === "legal" && (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Legal person
        </h3>

        {/* Full name */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Full name <span className="text-red-600">*</span>{" "}
            <span className="font-normal text-gray-500">(7/500)</span>
          </label>
          <input
            type="text"
            value={legalPersonName}
            onChange={(e) => setLegalPersonName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Postal Address Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Postal Address
          </h4>

          {/* Street name and number */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Street name and number <span className="text-red-600">*</span>{" "}
              <span className="font-normal text-gray-500">(12/2000)</span>
            </label>
            <textarea
              rows={3}
              value={legalPersonAddress}
              onChange={(e) => setLegalPersonAddress(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Zip Code */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Zip Code <span className="text-red-600">*</span>{" "}
              <span className="font-normal text-gray-500">(4/50)</span>
            </label>
            <input
              type="text"
              value={legalPersonZipCode}
              onChange={(e) => setLegalPersonZipCode(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* City/Town */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              City/Town <span className="text-red-600">*</span>{" "}
              <span className="font-normal text-gray-500">(11/300)</span>
            </label>
            <input
              type="text"
              value={legalPersonCity}
              onChange={(e) => setLegalPersonCity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Country <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <select
                value={legalPersonCountry?.key ?? ""}
                onChange={(e) => {
                  const country = countries.find(
                    (c) => c.key === e.target.value
                  );
                  setLegalPersonCountry(country ?? null);
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
        </div>

        {/* Contact person information section */}
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Contact person information
          </h4>
          <p className="text-xs text-gray-600 mb-4 italic">
            Contact person refers to the person who responds to enquiries
            concerning the application. The contact person's details can be
            forwarded to the controller during the processing of an application
            if additional information is required for defining the data
            extraction.
          </p>

          {/* Full name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Full name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={contactPersonName}
              onChange={(e) => setContactPersonName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={contactPersonEmail}
              onChange={(e) => setContactPersonEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Phone <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Country Code"
                value={contactPersonPhone.countryCode}
                onChange={(e) =>
                  setContactPersonPhone({
                    ...contactPersonPhone,
                    countryCode: e.target.value,
                  })
                }
                className="w-16 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={contactPersonPhone.number}
                onChange={(e) =>
                  setContactPersonPhone({
                    ...contactPersonPhone,
                    number: e.target.value,
                  })
                }
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="text"
                placeholder="ISO Code"
                value={contactPersonPhone.isoCode}
                onChange={(e) =>
                  setContactPersonPhone({
                    ...contactPersonPhone,
                    isoCode: e.target.value,
                  })
                }
                className="w-16 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Relationship */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              What is the relationship between the contact person and the
              applicant? (E.g. an employee applying for data on behalf of their
              organisation.) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={contactPersonRelationship}
              onChange={(e) => setContactPersonRelationship(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Organisation Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Name of the organisation <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={contactPersonOrganisationName}
              onChange={(e) =>
                setContactPersonOrganisationName(e.target.value)
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Business ID */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Business ID of the organisation{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={contactPersonBusinessID}
              onChange={(e) => setContactPersonBusinessID(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>
      )}

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

export default Section3;
