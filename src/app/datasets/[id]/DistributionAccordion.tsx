// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { DatasetDistribution } from "@/types/dataset.types";
import { formatDate } from "@/utils/formatDate";

interface DistributionAccordionProps {
  distributions: DatasetDistribution[];
}

const DistributionAccordion = ({
  distributions,
}: DistributionAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<null | number>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, distributions.length);
  }, [distributions]);

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
        <div className="mb-2 w-full" key={distribution.id}>
          <div
            onClick={() => toggleItem(index)}
            onKeyPress={() => toggleItem(index)}
            className="flex transform cursor-pointer items-center justify-between rounded border-2 border-b-0 bg-white-smoke p-4 transition duration-300 ease-in-out"
          >
            <span className="flex items-center">
              <FontAwesomeIcon icon={faFile} className="text-secondary" />
              <span className="ml-2">{distribution.name}</span>
              <span className="ml-4 inline-block bg-warning px-2.5 py-0.5 font-medium text-xs text-black">
                {distribution.format}
              </span>
            </span>
            <FontAwesomeIcon
              icon={openIndex === index ? faChevronUp : faChevronDown}
              className="text-secondary"
            />
          </div>
          <div
            ref={(el) => (contentRefs.current[index] = el)}
            style={{
              maxHeight:
                openIndex === index
                  ? `${contentRefs.current[index]?.scrollHeight}px`
                  : "0",
              overflow: "hidden",
              transition: "max-height 0.5s ease",
            }}
            className="rounded-b border-2 border-t-0 bg-white"
          >
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
              <div>
                <strong className="block text-sm font-semibold">
                  Description:
                </strong>
                <span className="text-sm">{distribution.description}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold">
                  Compress Format:
                </strong>
                <span className="text-sm">{distribution.compressFormat}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold">Issued:</strong>
                <span className="text-sm">
                  {distribution.issued && formatDate(distribution.issued)}
                </span>
              </div>
              <div>
                <strong className="block text-sm font-semibold">
                  Last Modified:
                </strong>
                <span className="text-sm">
                  {distribution.modified && formatDate(distribution.modified)}
                </span>
              </div>
              <div>
                <strong className="block text-sm font-semibold">
                  Language:
                </strong>
                <span className="text-sm">{distribution.language}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold">
                  MIME Type:
                </strong>
                <span className="text-sm">{distribution.mimetype}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold">Rights:</strong>
                <span className="text-sm">{distribution.rights}</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold">
                  Spatial Resolution in Meters:
                </strong>
                <span className="text-sm">
                  {distribution.spatialResolutionInMeters}
                </span>
              </div>
              <div>
                <strong className="block text-sm font-semibold">
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
                    className="inline-flex items-center justify-center rounded bg-secondary px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-primary"
                  >
                    Access URL
                  </a>
                  {distribution.downloadUrl && (
                    <a
                      href={distribution.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 inline-flex items-center justify-center rounded bg-secondary px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-primary"
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
};

export default DistributionAccordion;
