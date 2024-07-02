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
        <div className="mb-2 w-full" key={distribution.id}>
          <div
            onClick={() => toggleItem(index)}
            onKeyPress={() => toggleItem(index)}
            className="flex cursor-pointer items-center justify-between rounded border-2 border-b-0 bg-surface p-4"
          >
            <span className="flex items-center">
              <FontAwesomeIcon icon={faFile} className="text-primary" />
              <span className="struncate ml-2 break-all">
                {distribution.title}
              </span>
              {distribution.format && (
                <span className="mx-2 inline-block bg-warning px-2.5 py-0.5 font-medium text-xs text-black">
                  {distribution.format.label}
                </span>
              )}
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
                <strong className="block text-sm font-semibold">Issued:</strong>
                <span className="font-date text-sm">
                  {distribution.createdAt && formatDate(distribution.createdAt)}
                </span>
              </div>
              {distribution.modifiedAt && (
                <div>
                  <strong className="block text-sm font-semibold">
                    Last Modified:
                  </strong>
                  <span className="font-date text-sm">
                    {distribution.modifiedAt &&
                      formatDate(distribution.modifiedAt)}
                  </span>
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
