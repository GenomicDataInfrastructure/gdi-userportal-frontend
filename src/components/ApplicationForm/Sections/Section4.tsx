// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const Section4: React.FC = () => {
  const [sameAsSection3, setSameAsSection3] = useState(false);
  const [invoiceType, setInvoiceType] = useState<string>("");
  const [financiallyCovered, setFinanciallyCovered] = useState<string>("");

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
          Payment details of the person to whom the health data access body
          addresses the bills related to this application and the consequential
          data permit, if granted.
        </p>
      </div>

      {/* Same as contact person checkbox */}
      <div className="mb-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="same-contact"
            checked={sameAsSection3}
            onChange={(e) => setSameAsSection3(e.target.checked)}
            className="mt-1 mr-3 h-4 w-4"
          />
          <label htmlFor="same-contact" className="text-sm text-gray-700">
            Same as contact person mentioned in the Section 3?
          </label>
        </div>
      </div>

      {/* Fill from user profile button */}
      <div className="mb-8">
        <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
          <span>⇄</span>
          <span>Fill from user profile</span>
        </button>
      </div>

      {/* Full name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Full name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Phone <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-2">
          <div className="w-16 flex items-center border border-gray-300 rounded px-2 py-2">
            <span className="text-xl">🇱🇺</span>
          </div>
          <input
            type="tel"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Address <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Invoice type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Invoice type <span className="text-red-600">*</span>
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="invoice-paper"
              name="invoiceType"
              value="paper"
              checked={invoiceType === "paper"}
              onChange={(e) => setInvoiceType(e.target.value)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="invoice-paper" className="text-sm text-gray-700">
              Paper
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="invoice-electronic"
              name="invoiceType"
              value="electronic"
              checked={invoiceType === "electronic"}
              onChange={(e) => setInvoiceType(e.target.value)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label
              htmlFor="invoice-electronic"
              className="text-sm text-gray-700"
            >
              Electronic
            </label>
          </div>
        </div>
      </div>

      {/* Invoice reference number */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Invoice reference number <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Is the project financially covered */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Is the project financially covered?{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="covered-yes"
              name="financiallyCovered"
              value="yes"
              checked={financiallyCovered === "yes"}
              onChange={(e) => setFinanciallyCovered(e.target.value)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="covered-yes" className="text-sm text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="covered-no"
              name="financiallyCovered"
              value="no"
              checked={financiallyCovered === "no"}
              onChange={(e) => setFinanciallyCovered(e.target.value)}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="covered-no" className="text-sm text-gray-700">
              No
            </label>
          </div>
        </div>
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

export default Section4;
