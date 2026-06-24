// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("datasets.detail");
  const [openIndex, setOpenIndex] = useState<null | number>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const notAvailableLabel = t("notAvailable");

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
                <Tooltip message={t("tooltips.openDatasetSeriesDetails")} />
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
                    <strong>{t("description")}: </strong>
                    <span>{seriesItem.description || notAvailableLabel}</span>
                    <Tooltip
                      message={t("tooltips.datasetSeriesDescriptionField")}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 relative group">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-primary align-middle"
                      />
                      <strong>{t("issued")}:</strong>
                      <span>
                        {seriesItem.issued
                          ? formatDate(seriesItem.issued)
                          : notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.datasetSeriesIssued")} />
                    </div>
                    <div className="flex items-center gap-2 relative group">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-primary align-middle"
                      />
                      <strong>{t("modified")}:</strong>
                      <span>
                        {seriesItem.modified
                          ? formatDate(seriesItem.modified)
                          : notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.datasetSeriesModified")} />
                    </div>
                    <div className="flex items-center gap-2 relative group">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-primary align-middle"
                      />
                      <strong>{t("frequency")}:</strong>
                      <span>
                        {seriesItem.frequency?.label || notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.datasetSeriesFrequency")} />
                    </div>
                    <div className="flex items-center gap-2 relative group">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className="text-primary align-middle"
                      />
                      <strong>{t("publisher")}:</strong>
                      <span>
                        {seriesItem.publishers
                          ?.map((publisher) => publisher.name)
                          .join(", ") || notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.datasetSeriesPublisher")} />
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
