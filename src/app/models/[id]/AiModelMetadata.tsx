// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import {
  faBuilding,
  faCalendarAlt,
  faCogs,
  faIdBadge,
  faInfoCircle,
  faLink,
  faSyncAlt,
  faTag,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import MetadataField from "@/components/metadata/MetadataField";
import MetadataKeywords from "@/components/metadata/MetadataKeywords";
import MetadataSection from "@/components/metadata/MetadataSection";
import NotProvided from "@/components/metadata/NotProvided";
import Tooltip from "@/components/Tooltip";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/utils/formatDate";
import { DiscoveryRetrievedAiModel } from "@/app/api/discovery/providers/types";
import ModelTasksAccordion from "./ModelTasksAccordion";

const AiModelMetadata = ({
  aiModel,
}: {
  aiModel: DiscoveryRetrievedAiModel;
}) => {
  const t = useTranslations("datasets.detail");
  const tAiModels = useTranslations("aiModels");
  const notProvidedLabel = t("notProvided");
  // formatDate() depends on the viewer's timezone, so only dates wait for
  // mount; the rest of the metadata remains server-rendered.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasDates =
    isMounted && Boolean(aiModel.createdAt || aiModel.modifiedAt);
  const hasPublishers = aiModel.publishers.length > 0;
  const hasAccessRights = Boolean(aiModel.accessRights);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 font-normal text-gray">
        {isMounted && aiModel.createdAt && (
          <span className="flex gap-2 items-center relative group">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="align-middle text-primary"
            />
            <span className="align-middle">
              {t("createdOn")} {formatDate(aiModel.createdAt)}
            </span>
            <Tooltip message={t("tooltips.datasetCreated")} />
          </span>
        )}
        {isMounted && aiModel.createdAt && aiModel.modifiedAt && (
          <div className="text-lightaccent hidden sm:inline-block">|</div>
        )}
        {isMounted && aiModel.modifiedAt && (
          <span className="flex gap-2 items-center relative group">
            <FontAwesomeIcon
              icon={faSyncAlt}
              className="align-middle text-primary"
            />
            <span className="align-middle">
              {t("modifiedOn")} {formatDate(aiModel.modifiedAt)}
            </span>
            <Tooltip message={t("tooltips.datasetUpdated")} />
          </span>
        )}
        {hasPublishers && (
          <>
            {hasDates && (
              <div className="text-lightaccent hidden sm:inline-block">|</div>
            )}
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faBuilding}
                className="align-middle text-primary"
              />
              <span className="flex flex-wrap gap-1 items-center">
                <span className="align-middle">{t("publishedBy")}</span>
                {aiModel.publishers.map((publisher, index) => (
                  <span key={publisher.name}>
                    <Link
                      href={`/models?page=1&q=${encodeURIComponent(publisher.name)}`}
                    >
                      {publisher.name || t("noTitle")}
                    </Link>
                    {index < aiModel.publishers.length - 1 && ", "}
                  </span>
                ))}
              </span>
              <Tooltip message={t("tooltips.datasetPublishers")} />
            </span>
          </>
        )}
        {aiModel.accessRights && (
          <>
            {hasDates || hasPublishers ? (
              <div className="text-lightaccent hidden sm:inline-block">|</div>
            ) : null}
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faTag}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("accessRights")}:{" "}
                {aiModel.accessRights.label || t("noAccessRightsInformation")}
              </span>
              <Tooltip message={t("tooltips.datasetAccessRights")} />
            </span>
          </>
        )}
        {aiModel.identifier && (
          <>
            {hasDates || hasPublishers || hasAccessRights ? (
              <div className="text-lightaccent hidden sm:inline-block">|</div>
            ) : null}
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faIdBadge}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("identifier")}: {aiModel.identifier}
              </span>
              <Tooltip message={t("tooltips.datasetIdentifier")} />
            </span>
          </>
        )}
      </div>

      <MetadataKeywords
        keywords={aiModel.keywords ?? []}
        label={t("keywords")}
        tooltip={t("tooltips.datasetKeywords")}
      />

      <MetadataKeywords
        keywords={aiModel.libraries ?? []}
        label={tAiModels("libraries")}
        tooltip={tAiModels("tooltips.libraries")}
      />

      {aiModel.modelTasks && aiModel.modelTasks.length > 0 && (
        <MetadataSection title={tAiModels("modalities")} icon={faCogs}>
          <ModelTasksAccordion modelTasks={aiModel.modelTasks} />
        </MetadataSection>
      )}

      {aiModel.documentation && aiModel.documentation.length > 0 && (
        <MetadataSection title={t("linksAndReferences")} icon={faLink}>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 flex-wrap relative group">
              <span className="font-medium shrink-0 max-w-full">
                {t("documentation")}:
              </span>
              {aiModel.documentation.map((doc, index) => (
                <a
                  key={index}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info hover:text-hover-color hover:underline"
                >
                  {doc}
                </a>
              ))}
              <Tooltip message={t("tooltips.documentation")} />
            </div>
          </div>
        </MetadataSection>
      )}

      {(aiModel.publishers.length > 0 || aiModel.creators.length > 0) && (
        <MetadataSection
          title={t("publisherAndDataGovernance")}
          icon={faUserShield}
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 flex-wrap relative group">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-primary text-xs"
              />
              <span className="font-medium shrink-0 max-w-full">
                {t("publishers")}:
              </span>
              {aiModel.publishers.length > 0 ? (
                aiModel.publishers.map((publisher, index) => (
                  <span key={publisher.name}>
                    <Link
                      href={`/models?page=1&q=${encodeURIComponent(publisher.name)}`}
                    >
                      {publisher.name || t("noTitle")}
                    </Link>
                    {index < aiModel.publishers.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip message={t("tooltips.datasetPublishers")} />
            </div>
            <div className="flex items-center gap-2 flex-wrap relative group">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-primary text-xs"
              />
              <span className="font-medium shrink-0 max-w-full">
                {t("creators")}:
              </span>
              {aiModel.creators.length > 0 ? (
                aiModel.creators.map((agent, index) => (
                  <span key={index} className="flex items-center gap-1">
                    <span>
                      {agent.name}
                      {agent.email && (
                        <span className="ml-1 text-info">({agent.email})</span>
                      )}
                    </span>
                    {index < aiModel.creators.length - 1 && ","}
                  </span>
                ))
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip message={t("tooltips.creators")} />
            </div>
          </div>
        </MetadataSection>
      )}

      {(aiModel.version || aiModel.versionNotes) && (
        <MetadataSection title={t("versionInformation")} icon={faInfoCircle}>
          <div className="flex flex-col gap-2 text-sm">
            <MetadataField label={t("version")} tooltip={t("tooltips.version")}>
              {aiModel.version || <NotProvided label={notProvidedLabel} />}
            </MetadataField>
            <div className="flex items-start gap-2 flex-wrap relative group">
              <span className="font-medium shrink-0 max-w-full">
                {t("versionNotes")}:
              </span>
              {aiModel.versionNotes ? (
                <ul className="list-disc pl-4">
                  {aiModel.versionNotes.split("\n").map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip message={t("tooltips.versionNotes")} />
            </div>
          </div>
        </MetadataSection>
      )}
    </>
  );
};

export default AiModelMetadata;
