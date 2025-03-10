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
  faLink,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import Tooltip from "./Tooltip";
import { RetrievedDistribution } from "@/app/api/discovery/open-api/schemas";

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
          className="mb-2 w-full rounded-2xl bg-surface hover:bg-hover transition relative"
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
            ref={(el: HTMLDivElement | null) => {
              contentRefs.current[index] = el;
            }}
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
              <div className="relative group">
                <strong className="block text-sm font-semibold">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-primary align-middle mr-2"
                  />
                  Description:
                </strong>
                <span className="text-sm">{distribution.description}</span>
                <Tooltip message="Description of the distribution." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center relative">
                  <span className="group flex items-center">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="text-primary align-middle mr-2"
                    />
                    <strong className="text-sm font-semibold">
                      Created On:
                    </strong>
                    <span className="text-sm ml-2">
                      {distribution.createdAt
                        ? formatDate(distribution.createdAt)
                        : "NA"}
                    </span>
                    <Tooltip message="Date when the distribution was created." />
                  </span>
                </div>
                <div className="flex items-center relative">
                  <span className="group flex items-center">
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
                    <Tooltip message="Date when the distribution was last modified." />
                  </span>
                </div>
                <div className="flex items-center relative">
                  <span className="group flex items-center">
                    <FontAwesomeIcon
                      icon={faFile}
                      className="text-primary align-middle mr-2"
                    />
                    <strong className="text-sm font-semibold">
                      File Type:
                    </strong>
                    <span className="text-sm ml-2">
                      {distribution.format?.label || "NA"}
                    </span>
                    <Tooltip message="File type of the distribution." />
                  </span>
                </div>
                {distribution.downloadUrl && (
                  <div className="flex items-center relative">
                    <span className="group flex items-center">
                      <FontAwesomeIcon
                        icon={faLink}
                        className="text-primary align-middle mr-2"
                      />
                      <strong className="text-sm font-semibold">
                        Download URL:
                      </strong>
                      <a
                        href={distribution.downloadUrl}
                        className="text-sm text-primary ml-2 break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                      <Tooltip message="Link to download the distribution." />
                    </span>
                  </div>
                )}
                {distribution.languages &&
                  distribution.languages.length > 0 && (
                    <div className="flex items-center relative">
                      <span className="group flex items-center">
                        <FontAwesomeIcon
                          icon={faLanguage}
                          className="text-primary align-middle mr-2"
                        />
                        <span className="align-middle">
                          Languages:{" "}
                          {distribution.languages
                            .map((lang) => lang.label)
                            .join(", ")}
                        </span>
                        <Tooltip message="Languages in which the distribution is available." />
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistributionAccordion;
