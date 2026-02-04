// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import { UpdateApplicationSection1Request } from "@/app/api/access-management-v1";
import { SectionProps } from "../ApplicationFormContent";

const getLocalizedText = (
  value: Record<string, string> | string | undefined
) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en ?? Object.values(value)[0] ?? "";
};

const Section1: React.FC<SectionProps> = ({
  applicationData,
  sectionDataRef,
}) => {
  const [checkedVariables, setCheckedVariables] = useState<Set<string>>(
    new Set()
  );

  // Initialize checked variables from applicationData
  useEffect(() => {
    if (applicationData?.form?.section1?.datasetVariables) {
      const initialChecked = new Set(
        applicationData.form.section1.datasetVariables.map(
          (v) => `${v.datasetId}-${v.name}`
        )
      );
      setCheckedVariables(initialChecked);
    }
  }, [applicationData?.form?.section1?.datasetVariables]);

  // Update sectionDataRef when checked variables change
  useEffect(() => {
    if (sectionDataRef && applicationData) {
      // Build datasetVariables array from all variables, filtering by checked ones
      const datasetVariables = (applicationData.datasets ?? []).flatMap(
        (dataset) =>
          (dataset.distributions_sample ?? []).flatMap((distribution) => {
            const variables = distribution.variables ?? [];
            return variables
              .filter((v) =>
                checkedVariables.has(`${dataset.dataset_id}-${v.name}`)
              )
              .map((v) => ({
                ...v,
                datasetId: dataset.dataset_id,
              }));
          })
      );

      const section1Data: UpdateApplicationSection1Request = {
        sectionNumber: 1,
        removedDistributions:
          applicationData.form?.section1?.removedDistributions ?? [],
        removedDatasets: applicationData.form?.section1?.removedDatasets ?? [],
        datasetVariables,
      };
      sectionDataRef.current = section1Data;
    }
  }, [applicationData, sectionDataRef, checkedVariables]);

  const handleVariableChange = (
    datasetId: string,
    variableName: string,
    isChecked: boolean
  ) => {
    const key = `${datasetId}-${variableName}`;
    const newChecked = new Set(checkedVariables);
    if (isChecked) {
      newChecked.add(key);
    } else {
      newChecked.delete(key);
    }
    setCheckedVariables(newChecked);
  };

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
                {applicationData?.title || ""}
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
        {(applicationData?.datasets ?? []).map((dataset) => {
          const rows = (dataset.distributions_sample ?? [])
            .flatMap((distribution) => distribution.variables ?? [])
            .filter(Boolean);

          if (rows.length === 0) return null;

          return (
            <div
              key={dataset.dataset_id}
              className="overflow-x-auto border border-gray-200 rounded-lg"
            >
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-surface">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" />
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
                  {rows.map((row, index) => {
                    const descriptionText = getLocalizedText(row.description);
                    const variableKey = `${dataset.dataset_id}-${row.name}`;
                    const isChecked = checkedVariables.has(variableKey);

                    return (
                      <tr
                        key={`${row.name}-${index}`}
                        className={index % 2 === 0 ? "bg-white" : "bg-surface"}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handleVariableChange(
                                dataset.dataset_id,
                                row.name,
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {row.datatype}
                        </td>
                        <td className="max-w-sm px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <span>{descriptionText}</span>
                            {descriptionText.includes("http") && (
                              <FontAwesomeIcon
                                icon={faExternalLink}
                                size="sm"
                                className="mt-0.5 flex-shrink-0 text-primary"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Dataset Details */}
        {(applicationData?.datasets ?? []).map((dataset) => {
          const countryLabel = dataset.country?.label ?? "";
          const dataHolder = dataset.publisher?.name ?? "";
          const accessBody = dataset.hdab?.name ?? "";
          const provenanceText = getLocalizedText(dataset.provenance);

          if (!countryLabel && !dataHolder && !accessBody && !provenanceText) {
            return null;
          }

          return (
            <div key={`${dataset.dataset_id}-details`} className="mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-900">
                    From which country/countries do you seek data? *
                  </label>
                  <div className="mt-2 rounded border border-gray-200 bg-white px-3 py-2 text-gray-900">
                    {countryLabel}
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-900">
                    From which data holder(s) will the data be extracted? *
                  </label>
                  <div className="mt-2 rounded border border-gray-200 bg-white px-3 py-2 text-gray-900">
                    {dataHolder}
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-900">
                    To which health data access body/bodies do you want to
                    submit the application? *
                  </label>
                  <div className="mt-2 rounded border border-gray-200 bg-white px-3 py-2 text-gray-900">
                    {accessBody}
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-900">
                    From which database(s) or registry/registries will the data
                    be extracted? *
                  </label>
                  <div className="mt-2 rounded border border-gray-200 bg-white px-3 py-2 text-gray-900 whitespace-pre-wrap">
                    {provenanceText}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Section1;
