// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Section3: React.FC = () => {
  const [publicSectorBody, setPublicSectorBody] = useState<string>("");
  const [mandateTasks, setMandateTasks] = useState<string>("");
  const [applicantType, setApplicantType] = useState<string>("natural");

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
      </div>

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
            defaultValue="Jon Doe"
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
              defaultValue="54 Grand-Rue"
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
              defaultValue="3926"
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
              defaultValue="Mondercange"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Country <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue="Luxembourg"
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded px-2 py-1 hover:bg-secondary">
                <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
              </button>
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
            defaultValue="zenovic.haris@live.com"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Phone <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            <div className="w-16 flex items-center border border-gray-300 rounded px-2 py-2">
              <span className="text-xl">🇱🇺</span>
            </div>
            <input
              type="tel"
              defaultValue="621561059"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Job title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Job title <span className="text-red-600">*</span>{" "}
            <span className="font-normal text-gray-500">(4/500)</span>
          </label>
          <input
            type="text"
            defaultValue="Test"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Affiliation */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Affiliation <span className="text-red-600">*</span>{" "}
            <span className="font-normal text-gray-500">(4/500)</span>
          </label>
          <input
            type="text"
            defaultValue="Test"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
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

export default Section3;
