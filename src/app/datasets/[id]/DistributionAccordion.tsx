// SPDX-FileCopyrightText: 2025 PNED G.I.E.
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
  faBalanceScale,
  faCheckCircle,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import Tooltip from "./Tooltip";
import { RetrievedDistribution } from "@/app/api/discovery/open-api/schemas";
import { useTranslations } from "next-intl";

interface DistributionAccordionProps {
  distributions: RetrievedDistribution[];
}

const DistributionAccordion = ({
  distributions,
}: DistributionAccordionProps) => {
  const t = useTranslations("datasets.detail");
  const [openIndex, setOpenIndex] = useState<null | number>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const notAvailableLabel = t("notAvailable");

  const getFormatLabel = (distribution: RetrievedDistribution) =>
    distribution.format?.label ||
    distribution.format?.value?.split("/").pop() ||
    notAvailableLabel;

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
    <div className="accordion w-full">
      {distributions.map((distribution, index) => (
        <div
          className="w-full border-b border-primary/20 last:border-b-0"
          key={distribution.id}
        >
          <button
            type="button"
            onClick={() => toggleItem(index)}
            className={`flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-3 text-left transition-colors ${
              openIndex === index ? "bg-hover" : "hover:bg-hover"
            }`}
            aria-expanded={openIndex === index}
          >
            <span className="flex items-center">
              <FontAwesomeIcon icon={faFile} className="text-primary" />
              <span className="ml-2 break-all font-medium">
                {distribution.title}
              </span>
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
            <div className="px-2 pb-4">
              <div className="ml-3 border-l-2 border-primary/20 pl-4">
                <div className="relative group">
                  <strong className="block text-sm font-semibold">
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className="text-primary align-middle mr-2"
                    />
                    {t("description")}:
                  </strong>
                  <span className="text-sm">{distribution.description}</span>
                  <Tooltip message={t("tooltips.distributionDescription")} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center relative">
                    <span className="group flex items-center">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-primary align-middle mr-2"
                      />
                      <strong className="text-sm font-semibold">
                        {t("createdOn")}:
                      </strong>
                      <span className="text-sm ml-2">
                        {distribution.createdAt
                          ? formatDate(distribution.createdAt)
                          : notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.distributionCreated")} />
                    </span>
                  </div>
                  <div className="flex items-center relative">
                    <span className="group flex items-center">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-primary align-middle mr-2"
                      />
                      <strong className="text-sm font-semibold">
                        {t("modifiedOn")}:
                      </strong>
                      <span className="text-sm ml-2">
                        {distribution.modifiedAt
                          ? formatDate(distribution.modifiedAt)
                          : notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.distributionModified")} />
                    </span>
                  </div>
                  <div className="flex items-center relative">
                    <span className="group flex items-center">
                      <FontAwesomeIcon
                        icon={faFile}
                        className="text-primary align-middle mr-2"
                      />
                      <strong className="text-sm font-semibold">
                        {t("fileType")}:
                      </strong>
                      <span className="text-sm ml-2">
                        {getFormatLabel(distribution)}
                      </span>
                      <Tooltip message={t("tooltips.distributionFileType")} />
                    </span>
                  </div>
                  <div className="flex items-center relative">
                    <span className="group flex items-center">
                      <FontAwesomeIcon
                        icon={faFile}
                        className="text-primary align-middle mr-2"
                      />
                      <strong className="text-sm font-semibold">
                        {t("mediaType")}:
                      </strong>
                      <span className="text-sm ml-2">
                        {distribution.mediaType?.label ||
                          distribution.mediaType?.value?.split("/").pop() ||
                          notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.distributionMediaType")} />
                    </span>
                  </div>
                  <div className="flex items-center relative">
                    <span className="group flex items-center">
                      <FontAwesomeIcon
                        icon={faBalanceScale}
                        className="text-primary align-middle mr-2"
                      />
                      <strong className="text-sm font-semibold">
                        {t("license")}:
                      </strong>
                      <span className="text-sm ml-2">
                        {distribution.license?.label ||
                          distribution.license?.value?.split("/").pop() ||
                          notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.distributionLicense")} />
                    </span>
                  </div>
                  <div className="flex items-center relative">
                    <span className="group flex items-center">
                      <FontAwesomeIcon
                        icon={faDatabase}
                        className="text-primary align-middle mr-2"
                      />
                      <strong className="text-sm font-semibold">
                        {t("byteSize")}:
                      </strong>
                      <span className="text-sm ml-2">
                        {distribution.byteSize !== undefined &&
                        distribution.byteSize !== null
                          ? distribution.byteSize.toLocaleString()
                          : notAvailableLabel}
                      </span>
                      <Tooltip message={t("tooltips.distributionByteSize")} />
                    </span>
                  </div>
                  {distribution.conformsTo &&
                    distribution.conformsTo.length > 0 && (
                      <div className="flex items-center relative">
                        <span className="group flex items-center">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-primary align-middle mr-2"
                          />
                          <strong className="text-sm font-semibold">
                            {t("conformsTo")}:
                          </strong>
                          <span className="text-sm ml-2">
                            {distribution.conformsTo
                              .map(
                                (c) =>
                                  c.label ||
                                  c.value?.split("/").pop() ||
                                  c.value
                              )
                              .join(", ")}
                          </span>
                          <Tooltip
                            message={t("tooltips.distributionConformsTo")}
                          />
                        </span>
                      </div>
                    )}
                  {distribution.accessUrl && (
                    <div className="flex items-center relative">
                      <span className="group flex items-center">
                        <FontAwesomeIcon
                          icon={faLink}
                          className="text-primary align-middle mr-2"
                        />
                        <strong className="text-sm font-semibold">
                          {t("accessUrl")}:
                        </strong>
                        <a
                          href={distribution.accessUrl}
                          className="text-sm text-primary ml-2 break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("here")}
                        </a>
                        <Tooltip
                          message={t("tooltips.distributionAccessUrl")}
                        />
                      </span>
                    </div>
                  )}
                  {distribution.downloadUrl && (
                    <div className="flex items-center relative">
                      <span className="group flex items-center">
                        <FontAwesomeIcon
                          icon={faLink}
                          className="text-primary align-middle mr-2"
                        />
                        <strong className="text-sm font-semibold">
                          {t("downloadUrl")}:
                        </strong>
                        <a
                          href={distribution.downloadUrl}
                          className="text-sm text-primary ml-2 break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("here")}
                        </a>
                        <Tooltip
                          message={t("tooltips.distributionDownloadUrl")}
                        />
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
                            {t("languages")}:{" "}
                            {distribution.languages
                              .map((lang) => lang.label)
                              .join(", ")}
                          </span>
                          <Tooltip
                            message={t("tooltips.distributionLanguages")}
                          />
                        </span>
                      </div>
                    )}
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
