// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { DatasetDistribution } from "@/types/dataset.types";

export default function DistributionAccordion({
  distributions,
}: {
  distributions: DatasetDistribution[];
}) {
  const [openIndex, setOpenIndex] = useState<null | number>(null);

  const toggleItem = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="accordion flex w-full flex-col items-center justify-center">
      {distributions.map((distribution, index) => (
        <div className="mb-4 w-full" key={distribution.id}>
          <div
            onClick={() => toggleItem(index)}
            className="flex transform cursor-pointer items-center justify-between bg-info p-4 text-white transition duration-300 ease-in-out hover:-translate-y-1"
          >
            <span>
              {distribution.name}
              <span className="ml-2 inline-block bg-secondary px-2.5 py-0.5 font-medium text-xs text-white">
                {distribution.format}
              </span>
            </span>
            <FontAwesomeIcon
              icon={openIndex === index ? faChevronUp : faChevronDown}
            />
          </div>
          <div
            className={`accordion-content transition-max-height overflow-hidden duration-500 ease-in-out ${openIndex === index ? "max-h-[1000px]" : "max-h-0"}`}
          >
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  Description:
                </strong>
                <span className="text-sm">{distribution.description}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  Compress Format:
                </strong>
                <span className="text-sm">{distribution.compressFormat}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  Issued:
                </strong>
                <span className="text-sm">{distribution.issued}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  Last Modified:
                </strong>
                <span className="text-sm">{distribution.modified}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  Language:
                </strong>
                <span className="text-sm">{distribution.language}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  MIME Type:
                </strong>
                <span className="text-sm">{distribution.mimetype}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  Rights:
                </strong>
                <span className="text-sm">{distribution.rights}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  Spatial Resolution in Meters:
                </strong>
                <span className="text-sm">
                  {distribution.spatialResolutionInMeters}
                </span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-gray-600">
                  Temporal Resolution:
                </strong>
                <span className="text-sm">
                  {distribution.temporalResolution}
                </span>
              </div>
              {distribution.accessUrl && (
                <div className="col-span-1 mt-4 flex justify-center sm:col-span-2 sm:justify-start">
                  <a
                    href={distribution.accessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-secondary"
                  >
                    Access URL
                  </a>
                  {distribution.downloadUrl && (
                    <a
                      href={distribution.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 inline-flex items-center justify-center rounded bg-primary px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-secondary"
                    >
                      Download URL
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
