// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { UpdateApplicationSection4Request } from "@/app/api/access-management-v1";
import { SectionProps } from "../ApplicationFormContent";

const Section4: React.FC<SectionProps> = ({
  applicationData,
  sectionDataRef,
}) => {
  const [sameAsSection3, setSameAsSection3] = useState(false);
  const [invoiceType, setInvoiceType] = useState<string>("paper");
  const [financiallyCovered, setFinanciallyCovered] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState({
    countryCode: "",
    number: "",
    isoCode: "",
  });
  const [operatorIdentifier, setOperatorIdentifier] = useState("");
  const [nameOfTheOrganisation, setNameOfTheOrganisation] = useState("");
  const [businessIdentifierOrganization, setBusinessIdentifierOrganization] =
    useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [invoiceReferenceNumber, setInvoiceReferenceNumber] = useState("");
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [peppolCode, setPeppolCode] = useState("");
  const [rangeOfAmountOfFinancing, setRangeOfAmountOfFinancing] = useState<{
    key: string;
    value: string;
  } | null>(null);

  // Initialize form data from applicationData
  useEffect(() => {
    if (applicationData?.form?.section4) {
      const section4 = applicationData.form.section4;
      setSameAsSection3(section4.sameAsContactPerson ?? false);
      setFullName(section4.fullName ?? "");
      setEmail(section4.email ?? "");
      setAddress(section4.address ?? "");
      setPhone(section4.phone ?? { countryCode: "", number: "", isoCode: "" });
      setOperatorIdentifier(section4.operatorIdentifier ?? "");
      setNameOfTheOrganisation(section4.nameOfTheOrganisation ?? "");
      setBusinessIdentifierOrganization(
        section4.businessIdentifierOrganization ?? ""
      );
      // Map enum keys: "a" = paper, "b" = electronic
      const invoiceTypeKey = section4.invoiceType?.key ?? "a";
      setInvoiceType(invoiceTypeKey === "a" ? "paper" : "electronic");
      setVatNumber(section4.vatNumber ?? "");
      // Map enum keys: "a" = yes, "b" = no
      const financiallyKey = section4.isTheProjectFinanciallyCovered?.key ?? "";
      setFinanciallyCovered(
        financiallyKey === "a" ? "yes" : financiallyKey === "b" ? "no" : ""
      );
      setInvoiceReferenceNumber(section4.invoiceReferenceNumber ?? "");
      setInvoiceAddress(section4.invoiceAddress ?? "");
      setPeppolCode(section4.peppolCode ?? "");
      setRangeOfAmountOfFinancing(section4.rangeOfAmountOfFinancing ?? null);
    }
  }, [applicationData?.form?.section4]);

  // Update sectionDataRef when form data changes
  useEffect(() => {
    if (sectionDataRef) {
      const section4Data: UpdateApplicationSection4Request = {
        sectionNumber: 4,
        sameAsContactPerson: sameAsSection3,
        fullName,
        email,
        address,
        phone,
        operatorIdentifier,
        nameOfTheOrganisation,
        businessIdentifierOrganization,
        invoiceType: {
          key: invoiceType === "paper" ? "a" : "b",
          value: invoiceType === "paper" ? "Paper" : "Electronic",
        },
        vatNumber,
        isTheProjectFinanciallyCovered: {
          key: financiallyCovered === "yes" ? "a" : "b",
          value: financiallyCovered === "yes" ? "Yes" : "No",
        },
        invoiceReferenceNumber,
        invoiceAddress: invoiceType === "paper" ? invoiceAddress : undefined,
        peppolCode,
        rangeOfAmountOfFinancing:
          financiallyCovered === "yes"
            ? (rangeOfAmountOfFinancing ?? undefined)
            : undefined,
      };
      sectionDataRef.current = section4Data;
    }
  }, [
    sectionDataRef,
    sameAsSection3,
    fullName,
    email,
    address,
    phone,
    operatorIdentifier,
    nameOfTheOrganisation,
    businessIdentifierOrganization,
    invoiceType,
    vatNumber,
    financiallyCovered,
    invoiceReferenceNumber,
    invoiceAddress,
    peppolCode,
    rangeOfAmountOfFinancing,
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
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Phone <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Country Code"
            value={phone.countryCode}
            onChange={(e) =>
              setPhone({ ...phone, countryCode: e.target.value })
            }
            className="w-16 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone.number}
            onChange={(e) => setPhone({ ...phone, number: e.target.value })}
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <input
            type="text"
            placeholder="ISO Code"
            value={phone.isoCode}
            onChange={(e) => setPhone({ ...phone, isoCode: e.target.value })}
            className="w-16 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Name of the organisation */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Name of the organisation <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={nameOfTheOrganisation}
          onChange={(e) => setNameOfTheOrganisation(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Business ID of the organisation */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Business ID of the organisation{" "}
          <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={businessIdentifierOrganization}
          onChange={(e) => setBusinessIdentifierOrganization(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* VAT number */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          VAT number <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={vatNumber}
          onChange={(e) => setVatNumber(e.target.value)}
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
          value={invoiceReferenceNumber}
          onChange={(e) => setInvoiceReferenceNumber(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* E-invoice address (EDI or IBAN) - only for Paper */}
      {invoiceType === "paper" && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            E-invoice address (EDI or IBAN){" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={invoiceAddress}
            onChange={(e) => setInvoiceAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      )}

      {/* Operator ID */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Operator ID <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={operatorIdentifier}
          onChange={(e) => setOperatorIdentifier(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Peppol code (if applicable) */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Peppol code (if applicable)
        </label>
        <input
          type="text"
          value={peppolCode}
          onChange={(e) => setPeppolCode(e.target.value)}
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

      {/* Range of amount of financing - only for Electronic */}
      {financiallyCovered === "yes" && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            What is the range of the amount of financing for the project which
            will use the requested data? <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <select
              value={rangeOfAmountOfFinancing?.key ?? ""}
              onChange={(e) => {
                const options = [
                  { key: "a", value: "0 - 10 000 €" },
                  { key: "b", value: "10 000 - 50 000 €" },
                  { key: "c", value: "50 000 - 100 000 €" },
                  { key: "d", value: "100 000 - 500 000 €" },
                  { key: "e", value: "500 000 - 1 000 000 €" },
                  { key: "f", value: "> 1 000 000 €" },
                ];
                const option = options.find((o) => o.key === e.target.value);
                setRangeOfAmountOfFinancing(option ?? null);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select a range</option>
              <option value="a">0 - 10 000 €</option>
              <option value="b">10 000 - 50 000 €</option>
              <option value="c">50 000 - 100 000 €</option>
              <option value="d">100 000 - 500 000 €</option>
              <option value="e">500 000 - 1 000 000 €</option>
              <option value="f">&gt; 1 000 000 €</option>
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"
            />
          </div>
        </div>
      )}

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
