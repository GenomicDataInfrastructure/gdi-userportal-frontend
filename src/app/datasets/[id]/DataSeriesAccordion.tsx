// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCalendarAlt,
  faClock,
  faLayerGroup,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import { DatasetSeries } from "@/app/api/discovery/open-api/schemas";
import Tooltip from "./Tooltip";

type DataSeriesAccordionProps = {
  series: DatasetSeries[];
};

const isExternalUrl = (value?: string): value is string =>
  Boolean(value && /^https?:\/\//i.test(value));

const resolveSeriesHref = (seriesItem: DatasetSeries): string =>
  isExternalUrl(seriesItem.identifier)
    ? seriesItem.identifier
    : `/datasets/${encodeURIComponent(seriesItem.id)}`;

export default function DataSeriesAccordion({
  series,
}: DataSeriesAccordionProps) {
  const [openIndex, setOpenIndex] = useState<null | number>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, series.length);
  }, [series]);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="accordion w-full">
      {series.map((seriesItem, index) => {
        const href = resolveSeriesHref(seriesItem);
        const external = isExternalUrl(href);

        return (
          <div
            className="w-full border-b border-primary/20 last:border-b-0"
            key={seriesItem.id}
          >
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-3 text-left transition-colors ${
                openIndex === index ? "bg-hover" : "hover:bg-hover"
              }`}
              aria-expanded={openIndex === index}
            >
              <span className="flex items-center relative group">
                <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
                <span className="ml-2 break-all font-medium">
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-info hover:text-hover-color hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {seriesItem.title}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-info hover:text-hover-color hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {seriesItem.title}
                    </Link>
                  )}
                </span>
                <Tooltip message="Open dataset series details." />
              </span>
              <FontAwesomeIcon
                icon={openIndex === index ? faChevronUp : faChevronDown}
                className="text-primary"
              />
            </button>
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
              className="overflow-hidden"
            >
              <div className="px-2 pb-4 text-sm">
                <div className="ml-3 border-l-2 border-primary/20 pl-4">
                  <div className="mb-2 relative group">
                    <strong>Description: </strong>
                    <span>{seriesItem.description || "NA"}</span>
                    <Tooltip message="Description of the dataset series." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 relative group">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-primary align-middle"
                      />
                      <strong>Issued:</strong>
                      <span>
                        {seriesItem.issued
                          ? formatDate(seriesItem.issued)
                          : "NA"}
                      </span>
                      <Tooltip message="Date when the dataset series was issued." />
                    </div>
                    <div className="flex items-center gap-2 relative group">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-primary align-middle"
                      />
                      <strong>Modified:</strong>
                      <span>
                        {seriesItem.modified
                          ? formatDate(seriesItem.modified)
                          : "NA"}
                      </span>
                      <Tooltip message="Date when the dataset series was last modified." />
                    </div>
                    <div className="flex items-center gap-2 relative group">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-primary align-middle"
                      />
                      <strong>Frequency:</strong>
                      <span>{seriesItem.frequency?.label || "NA"}</span>
                      <Tooltip message="Update frequency for the dataset series." />
                    </div>
                    <div className="flex items-center gap-2 relative group">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className="text-primary align-middle"
                      />
                      <strong>Publisher:</strong>
                      <span>
                        {seriesItem.publishers
                          ?.map((publisher) => publisher.name)
                          .join(", ") || "NA"}
                      </span>
                      <Tooltip message="Publishers responsible for the dataset series." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
