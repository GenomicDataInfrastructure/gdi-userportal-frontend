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
  faCalendarAlt,
  faFileAlt,
  faLanguage,
  faLock,
  faLink,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import { RetrievedDistribution } from "@/services/discovery/types/dataset.types";

interface DistributionAccordionProps {
  distributions: RetrievedDistribution[];
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
        <div
          className="mb-4 w-full rounded-2xl bg-surface hover:bg-hover transition"
          key={distribution.id}
        >
          <div
            onClick={() => toggleItem(index)}
            onKeyPress={() => toggleItem(index)}
            className="flex cursor-pointer items-center justify-between rounded-2xl p-4"
          >
            <span className="flex items-center">
              <FontAwesomeIcon icon={faFile} className="text-primary" />
              <span className="struncate ml-2 break-all">
                {distribution.title}
              </span>
            </span>
            <FontAwesomeIcon
              icon={openIndex === index ? faChevronUp : faChevronDown}
              className="text-primary"
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
            className="rounded-b-2xl bg-white"
          >
            <div className="p-4 pb-8">
              <div>
                <strong className="block text-sm font-semibold">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-primary align-middle mr-2"
                  />
                  Description:
                </strong>
                <span className="text-sm">{distribution.description}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center relative group">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-primary align-middle mr-2"
                  />
                  <strong className="text-sm font-semibold">Created On:</strong>
                  <span className="text-sm ml-2">
                    {distribution.createdAt
                      ? formatDate(distribution.createdAt)
                      : "NA"}
                  </span>
                  <div className="absolute left-0 mt-10 hidden group-hover:flex items-center bg-info text-white text-xs rounded-2xl py-1 px-2 z-10">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Date when the distribution was created.
                  </div>
                </div>
                <div className="flex items-center relative group">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-primary align-middle mr-2"
                  />
                  <strong className="text-sm font-semibold">
                    Modified On:
                  </strong>
                  <span className="text-sm ml-2">
                    {distribution.modifiedAt
                      ? formatDate(distribution.modifiedAt)
                      : "NA"}
                  </span>
                  <div className="absolute left-0 mt-10 hidden group-hover:flex items-center bg-info text-white text-xs rounded-2xl py-1 px-2 z-10">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Date when the distribution was last modified.
                  </div>
                </div>
                <div className="flex items-center relative group">
                  <FontAwesomeIcon
                    icon={faFile}
                    className="text-primary align-middle mr-2"
                  />
                  <strong className="text-sm font-semibold">FileType:</strong>
                  <span className="text-sm ml-2">
                    {distribution.format?.label || "NA"}
                  </span>
                  <div className="absolute left-0 mt-10 hidden group-hover:flex items-center bg-info text-white text-xs rounded-2xl py-1 px-2 z-10">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Format of the distribution file.
                  </div>
                </div>
                <div className="flex items-center relative group">
                  <FontAwesomeIcon
                    icon={faLanguage}
                    className="text-primary align-middle mr-2"
                  />
                  <strong className="text-sm font-semibold">Languages:</strong>
                  <span className="text-sm ml-2">
                    {distribution.languages
                      ?.map((lang) => lang.label)
                      .join(", ") || "NA"}
                  </span>
                  <div className="absolute left-0 mt-10 hidden group-hover:flex items-center bg-info text-white text-xs rounded-2xl py-1 px-2 z-10">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Languages in which the distribution is available.
                  </div>
                </div>
                <div className="flex items-center relative group">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-primary align-middle mr-2"
                  />
                  <strong className="text-sm font-semibold">Licenses:</strong>
                  <span className="text-sm ml-2">
                    {distribution.licenses
                      ?.map((license) => license.label)
                      .join(", ") || "NA"}
                  </span>
                  <div className="absolute left-0 mt-10 hidden group-hover:flex items-center bg-info text-white text-xs rounded-2xl py-1 px-2 z-10">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Licenses associated with the distribution.
                  </div>
                </div>
                <div className="flex items-center relative group">
                  <FontAwesomeIcon
                    icon={faLink}
                    className="text-primary align-middle mr-2"
                  />
                  <strong className="text-sm font-semibold">Link:</strong>
                  <a
                    href={distribution.uri}
                    className="text-sm text-primary ml-2 break-all"
                  >
                    Download
                  </a>
                  <div className="absolute left-0 mt-10 hidden group-hover:flex items-center bg-info text-white text-xs rounded-2xl py-1 px-2 z-10">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Link to download the distribution file.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistributionAccordion;
