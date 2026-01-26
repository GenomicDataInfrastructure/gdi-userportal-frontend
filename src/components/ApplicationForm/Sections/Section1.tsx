// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";

const Section1: React.FC = () => {
  return (
    <>
      {/* Main Question */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            From which dataset record(s) or register(s) and/or distribution(s)
            will the data be extracted? *
          </h3>
          <button className="text-gray-400 hover:text-gray-600">
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>

        {/* Dataset Selection Card */}
        <div className="mt-4 border border-gray-200 rounded-lg bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                [Test] European Core Health Indicators (ECHI)
              </p>
              <span className="mt-1 inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Completed
              </span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
        </div>
      </div>

      {/* Variables Table */}
      <div className="mt-8">
        <h3 className="mb-4 text-base font-semibold text-gray-900">
          Variables
        </h3>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-surface">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" defaultChecked />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Variables
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Datatypes (CSV/W/XSD)
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "EncounterID",
                  datatype: "integer",
                  description: "Unique encounter identifier.",
                },
                {
                  name: "CountryOfResidence",
                  datatype: "string",
                  description:
                    "The patient's country of residence, using the EU country authority list.\nhttp://publications.europa.eu/resource/authority/country",
                },
                {
                  name: "CauseOfDeathIndicator",
                  datatype: "boolean",
                  description:
                    "Indicates whether this encounter is related to a cause of death.\nhttps://terminology.health.com/glossary/CauseOfDeathIndicator",
                },
                {
                  name: "Diabetes",
                  datatype: "boolean",
                  description: "True if patient has a diabetes diagnosis.",
                },
                {
                  name: "DiagnosisCode",
                  datatype: "string",
                  description:
                    "Primary diagnosis (ICD-10 code).\nhttp://purl.bioontology.org/ontology/ICD10",
                },
                {
                  name: "PatientID",
                  datatype: "string",
                  description: "Pseudonymized patient identifier.",
                },
              ].map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-surface"}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" defaultChecked />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {row.datatype}
                  </td>
                  <td className="max-w-sm px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <span>{row.description}</span>
                      {row.description.includes("http") && (
                        <FontAwesomeIcon
                          icon={faExternalLink}
                          size="sm"
                          className="mt-0.5 flex-shrink-0 text-primary"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Section1;
