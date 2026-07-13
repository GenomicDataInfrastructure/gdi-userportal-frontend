// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faSyncAlt,
  faBuilding,
  faTag,
  faFile,
  faCalendarAlt,
  faKey,
  faLanguage,
  faIdBadge,
  faDatabase,
  faHeartPulse,
  faUsers,
  faGlobe,
  faGavel,
  faClock,
  faChartBar,
  faCode,
  faLink,
  faLayerGroup,
  faInfoCircle,
  faUserShield,
  faNoteSticky,
  faCheckCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import DistributionAccordion from "./DistributionAccordion";
import DataSeriesAccordion from "./DataSeriesAccordion";
import { Link } from "@/i18n/navigation";
import Tooltip from "./Tooltip";
import Chips from "@/components/Chips";
import { useTranslations } from "next-intl";
import {
  DatasetDictionaryEntry,
  DatasetRelationEntry,
  RetrievedDataset,
  SearchedDataset,
  ValueLabel,
} from "@/app/api/discovery/open-api/schemas";

const MetadataSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: IconDefinition;
  children: React.ReactNode;
}) => (
  <div className="mt-4 p-4 bg-surface rounded-lg">
    <h2 className="text-[18px] font-semibold pb-2.5 flex items-center gap-2">
      <FontAwesomeIcon icon={icon} className="text-primary" />
      {title}
    </h2>
    {children}
  </div>
);

const MetadataField = ({
  label,
  children,
  icon,
  tooltip,
}: {
  label: string;
  children: React.ReactNode;
  icon?: IconDefinition;
  tooltip?: string;
}) => (
  <div className="flex items-center gap-2 flex-wrap relative group">
    {icon && <FontAwesomeIcon icon={icon} className="text-primary text-xs" />}
    <span className="font-medium shrink-0">{label}:</span>
    <span>{children}</span>
    {tooltip && <Tooltip message={tooltip} />}
  </div>
);

const NotProvided = ({ label }: { label: string }) => (
  <span className="text-primary">{label}</span>
);

type ExtendedRetrievedDataset = RetrievedDataset & {
  publisherType?: ValueLabel[];
  publisherNote?: string;
  temporalCoverage?:
    | RetrievedDataset["temporalCoverage"]
    | { start?: string; end?: string };
  analytics?: RetrievedDataset["analytics"] | string[];
};

const DatasetMetadata = ({
  dataset,
  relationships,
  dictionary,
  seriesMembers = [],
}: {
  dataset: ExtendedRetrievedDataset;
  relationships: DatasetRelationEntry[];
  dictionary: DatasetDictionaryEntry[];
  seriesMembers?: SearchedDataset[];
}) => {
  const t = useTranslations("datasets.detail");
  const helpText = dataset.helpText as Record<string, string> | undefined;
  const [userTimezone, setUserTimezone] = useState<string | null>(null);
  const notProvidedLabel = t("notProvided");
  const notAvailableLabel = t("notAvailable");
  const presentLabel = t("present");
  const indefiniteLabel = t("indefinite");
  const unknownLabel = t("unknown");
  const temporalCoverageCandidate = dataset.temporalCoverage as unknown;
  const temporalCoverageSource = Array.isArray(temporalCoverageCandidate)
    ? (temporalCoverageCandidate as Array<{ start?: string; end?: string }>)
    : temporalCoverageCandidate && typeof temporalCoverageCandidate === "object"
      ? [temporalCoverageCandidate as { start?: string; end?: string }]
      : [];
  const temporalCoverage = temporalCoverageSource.filter(
    (coverage) => coverage.start || coverage.end
  );
  const hasTemporalCoverage = temporalCoverage.length > 0;
  const hasHealthTheme =
    dataset.themes?.some((item) => item.label.includes("Health")) ?? false;
  const analytics =
    dataset.analytics
      ?.map((entry) =>
        typeof entry === "string" ? entry : entry.title || entry.description
      )
      .filter((entry): entry is string => Boolean(entry)) ?? [];
  const renderTemporalCoverage = () => {
    if (!hasTemporalCoverage) {
      return <NotProvided label={notProvidedLabel} />;
    }

    const temporalCoverageLabel = temporalCoverage
      .map(
        (coverage) =>
          `${coverage.start ? formatDate(coverage.start) : notAvailableLabel} — ${coverage.end ? formatDate(coverage.end) : presentLabel}`
      )
      .join(", ");

    return <span>{temporalCoverageLabel}</span>;
  };

  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(timezone);
    } catch (error) {
      console.error("Error fetching user timezone", error);
    }
  }, []);

  if (userTimezone === null) {
    return null;
  }

  if (dataset.isSeries) {
    return (
      <>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 font-normal text-gray">
          {dataset.createdAt && (
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("createdOn")} {formatDate(dataset.createdAt)}
              </span>
              <Tooltip
                message={
                  helpText?.["createdAt"] ?? t("tooltips.datasetSeriesCreated")
                }
              />
            </span>
          )}
          {dataset.createdAt && dataset.modifiedAt && (
            <div className="text-lightaccent hidden sm:inline-block">|</div>
          )}
          {dataset.modifiedAt && (
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faSyncAlt}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("modifiedOn")} {formatDate(dataset.modifiedAt)}
              </span>
              <Tooltip
                message={
                  helpText?.["modifiedAt"] ?? t("tooltips.datasetSeriesUpdated")
                }
              />
            </span>
          )}
          {dataset.identifier && (
            <>
              <div className="text-lightaccent hidden sm:inline-block">|</div>
              <span className="flex gap-2 items-center relative group">
                <FontAwesomeIcon
                  icon={faIdBadge}
                  className="align-middle text-primary"
                />
                <span className="align-middle">
                  {t("identifier")}: {dataset.identifier}
                </span>
                <Tooltip
                  message={
                    helpText?.["identifier"] ??
                    t("tooltips.datasetSeriesIdentifier")
                  }
                />
              </span>
            </>
          )}
        </div>

        <MetadataSection title={t("seriesOverview")} icon={faLayerGroup}>
          <div className="flex flex-col gap-3 text-sm">
            <MetadataField
              label={t("updateFrequency")}
              icon={faSyncAlt}
              tooltip={
                helpText?.["frequency"] ??
                t("tooltips.datasetSeriesUpdateFrequency")
              }
            >
              {dataset.frequency?.label || (
                <NotProvided label={notProvidedLabel} />
              )}
            </MetadataField>
            <MetadataField
              label={t("accessRights")}
              icon={faTag}
              tooltip={
                helpText?.["accessRights"] ??
                t("tooltips.datasetSeriesAccessRights")
              }
            >
              {dataset.accessRights?.label || (
                <NotProvided label={notProvidedLabel} />
              )}
            </MetadataField>
            <div className="flex items-center gap-2 flex-wrap relative group">
              <span className="font-medium shrink-0">{t("uri")}:</span>
              {dataset.uri ? (
                <a
                  href={dataset.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info hover:text-hover-color hover:underline break-all"
                >
                  {dataset.uri}
                </a>
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={helpText?.["uri"] ?? t("tooltips.datasetSeriesUri")}
              />
            </div>
          </div>
        </MetadataSection>

        <MetadataSection title={t("coverage")} icon={faGlobe}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">
                {t("spatialCoverage")}:
              </span>
              {dataset.spatialCoverage && dataset.spatialCoverage.length > 0 ? (
                <Chips
                  chips={dataset.spatialCoverage.map(
                    (coverage) =>
                      coverage.text || coverage.uri?.label || unknownLabel
                  )}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={
                  helpText?.["spatialCoverage"] ??
                  t("tooltips.datasetSeriesSpatialCoverage")
                }
              />
            </div>
            <MetadataField
              label={t("temporalCoverage")}
              tooltip={
                helpText?.["temporalCoverage"] ??
                t("tooltips.datasetSeriesTemporalCoverage")
              }
            >
              {renderTemporalCoverage()}
            </MetadataField>
          </div>
        </MetadataSection>

        <MetadataSection title={t("legalAndCompliance")} icon={faGavel}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">
                {t("applicableLegislation")}:
              </span>
              {dataset.applicableLegislation &&
              dataset.applicableLegislation.length > 0 ? (
                <Chips
                  chips={dataset.applicableLegislation.map(
                    (item) => item.label
                  )}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={
                  helpText?.["applicableLegislation"] ??
                  t("tooltips.datasetSeriesApplicableLegislation")
                }
              />
            </div>
          </div>
        </MetadataSection>

        <MetadataSection title={t("memberDatasets")} icon={faDatabase}>
          <div className="flex flex-col gap-3 text-sm">
            {seriesMembers.length > 0 ? (
              seriesMembers.map((member) => (
                <div
                  key={member.id}
                  className="border-b border-primary/20 pb-2 last:border-b-0"
                >
                  <Link
                    href={`/datasets/${member.id}`}
                    className="text-info hover:text-hover-color hover:underline font-medium"
                  >
                    {member.title}
                  </Link>
                  {member.description && (
                    <p className="mt-1 text-xs text-gray">
                      {member.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <span className="text-primary">{t("noMemberDatasetsFound")}</span>
            )}
          </div>
        </MetadataSection>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 font-normal text-gray">
        {dataset.createdAt && (
          <span className="flex gap-2 items-center relative group">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="align-middle text-primary"
            />
            <span className="align-middle">
              {t("createdOn")} {formatDate(dataset.createdAt)}
            </span>
            <Tooltip
              message={helpText?.["createdAt"] ?? t("tooltips.datasetCreated")}
            />
          </span>
        )}
        {dataset.createdAt && dataset.modifiedAt && (
          <div className="text-lightaccent hidden sm:inline-block">|</div>
        )}
        {dataset.modifiedAt && (
          <span className="flex gap-2 items-center relative group">
            <FontAwesomeIcon
              icon={faSyncAlt}
              className="align-middle text-primary"
            />
            <span className="align-middle">
              {t("modifiedOn")} {formatDate(dataset.modifiedAt)}
            </span>
            <Tooltip
              message={helpText?.["modifiedAt"] ?? t("tooltips.datasetUpdated")}
            />
          </span>
        )}
        {dataset.languages && dataset.languages.length > 0 && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faLanguage}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("languages")}:{" "}
                {dataset.languages.map((lang) => lang.label).join(", ")}
              </span>
              <Tooltip
                message={
                  helpText?.["languages"] ?? t("tooltips.datasetLanguages")
                }
              />
            </span>
          </>
        )}
        {dataset.publishers && dataset.publishers.length > 0 && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faBuilding}
                className="align-middle text-primary"
              />
              <span className="flex flex-wrap gap-1 items-center">
                <span className="align-middle">{t("publishedBy")}</span>
                {dataset.publishers.map((publisher, index) => (
                  <span key={publisher.name}>
                    <Link
                      href={`/datasets?page=1&ckan-publisherName=${publisher.name}`}
                    >
                      {publisher.name || t("noTitle")}
                    </Link>
                    {index < dataset.publishers!.length - 1 && ", "}
                  </span>
                ))}
              </span>
              <Tooltip
                message={
                  helpText?.["publishers"] ?? t("tooltips.datasetPublishers")
                }
              />
            </span>
          </>
        )}
        {dataset.accessRights && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faTag}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("accessRights")}:{" "}
                {dataset.accessRights.label || t("noAccessRightsInformation")}
              </span>
              <Tooltip
                message={
                  helpText?.["accessRights"] ??
                  t("tooltips.datasetAccessRights")
                }
              />
            </span>
          </>
        )}
        {dataset.identifier && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faIdBadge}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("identifier")}: {dataset.identifier}
              </span>
              <Tooltip
                message={
                  helpText?.["identifier"] ?? t("tooltips.datasetIdentifier")
                }
              />
            </span>
          </>
        )}
        {dataset.distributions && dataset.distributions.length > 0 && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faFile}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("distributionCount", {
                  count: dataset.distributions.length,
                })}
              </span>
              <Tooltip
                message={
                  helpText?.["distributions"] ??
                  t("tooltips.datasetDistributionCount")
                }
              />
            </span>
          </>
        )}
        {dataset.inSeries && dataset.inSeries.length > 0 && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("datasetSeriesCount", {
                  count: dataset.inSeries.length,
                })}
              </span>
              <Tooltip message={t("tooltips.datasetSeriesCount")} />
            </span>
          </>
        )}
        {dataset.dcatType && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faDatabase}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {t("type")}: {dataset.dcatType.label}
              </span>
              <Tooltip
                message={helpText?.["dcatType"] ?? t("tooltips.datasetType")}
              />
            </span>
          </>
        )}
      </div>
      {dataset.keywords && dataset.keywords.length > 0 && (
        <div className="mt-4">
          <span className="flex gap-2 items-center relative group">
            <FontAwesomeIcon
              icon={faKey}
              className="align-middle text-primary"
            />
            <span className="align-middle">{t("keywords")}:</span>
            <div className="flex flex-wrap gap-1">
              {dataset.keywords.map((keyword) => (
                <span
                  className="bg-warning bg-opacity-50 px-4 py-1 rounded-full text-gray font-medium text-[14px] inline-block"
                  key={keyword}
                >
                  {keyword}
                </span>
              ))}
            </div>
            <Tooltip
              message={helpText?.["keywords"] ?? t("tooltips.datasetKeywords")}
            />
          </span>
        </div>
      )}
      {relationships && relationships.length > 0 && (
        <MetadataSection title={t("datasetRelations")} icon={faLink}>
          <div className="flex flex-col gap-3 text-sm">
            {relationships.map((relationship, index) => (
              <div
                key={index}
                className="flex items-start gap-2 flex-wrap relative group"
              >
                <span className="font-medium shrink-0 min-w-[140px]">
                  {relationship.relation}:
                </span>
                <Link
                  href={`/@${dataset.publishers?.map((p) => p.name).join(",")}/${relationship.target}`}
                  className="text-info hover:text-hover-color hover:underline break-all"
                >
                  {t("datasetLink")}
                </Link>
                <Tooltip
                  message={
                    helpText?.["datasetRelationships"] ??
                    t("tooltips.relatedDatasetLink")
                  }
                />
              </div>
            ))}
          </div>
        </MetadataSection>
      )}
      {dictionary && dictionary.length > 0 && (
        <div className="mt-4">
          <h2 className="text-[18px] font-semibold py-2.5">
            {t("datasetDictionary")}
          </h2>
          <div className="flex flex-col gap-2">
            {dictionary.map((entry, index) => (
              <div
                key={index}
                className="flex items-center gap-2 relative group"
              >
                <span className="inline-flex items-center gap-2 text-gray-800 text-[15px] font-bold">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="align-middle text-primary"
                  />
                  {entry.name}
                </span>
                <span className="text-sm text-gray-800">({entry.type}):</span>
                <p className="text-sm font-normal text-gray text-[15px] m-0">
                  {entry.description}
                </p>
                <Tooltip
                  message={
                    helpText?.["dataDictionary"] ??
                    t("tooltips.datasetDictionaryField")
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {hasHealthTheme &&
        ((dataset.healthTheme && dataset.healthTheme.length > 0) ||
          (dataset.healthCategory && dataset.healthCategory.length > 0)) && (
          <MetadataSection title={t("healthInformation")} icon={faHeartPulse}>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex flex-wrap gap-2 items-center relative group">
                <span className="font-medium shrink-0">
                  {t("healthThemes")}:
                </span>
                {dataset.healthTheme && dataset.healthTheme.length > 0 ? (
                  <Chips
                    chips={dataset.healthTheme.map((item) => item.label)}
                    className="bg-primary/10 text-primary rounded-full py-1"
                  />
                ) : (
                  <NotProvided label={notProvidedLabel} />
                )}
                <Tooltip
                  message={
                    helpText?.["healthTheme"] ?? t("tooltips.healthThemes")
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center relative group">
                <span className="font-medium shrink-0">
                  {t("healthCategories")}:
                </span>
                {dataset.healthCategory && dataset.healthCategory.length > 0 ? (
                  <Chips
                    chips={dataset.healthCategory.map((item) => item.label)}
                    className="bg-primary/10 text-primary rounded-full py-1"
                  />
                ) : (
                  <NotProvided label={notProvidedLabel} />
                )}
                <Tooltip
                  message={
                    helpText?.["healthCategory"] ??
                    t("tooltips.healthCategories")
                  }
                />
              </div>
            </div>
          </MetadataSection>
        )}

      {hasHealthTheme && (
        <MetadataSection title={t("populationAndDemographics")} icon={faUsers}>
          <div className="flex flex-col gap-3 text-sm">
            <MetadataField
              label={t("populationCoverage")}
              tooltip={
                helpText?.["populationCoverage"] ??
                t("tooltips.populationCoverage")
              }
            >
              {dataset.populationCoverage || (
                <NotProvided label={notProvidedLabel} />
              )}
            </MetadataField>
            <div className="flex items-center gap-4 flex-wrap">
              <MetadataField
                label={t("numberOfRecords")}
                icon={faChartBar}
                tooltip={
                  helpText?.["numberOfRecords"] ?? t("tooltips.numberOfRecords")
                }
              >
                {dataset.numberOfRecords !== undefined ? (
                  dataset.numberOfRecords.toLocaleString()
                ) : (
                  <NotProvided label={notProvidedLabel} />
                )}
              </MetadataField>
              <MetadataField
                label={t("uniqueIndividuals")}
                icon={faUsers}
                tooltip={
                  helpText?.["numberOfUniqueIndividuals"] ??
                  t("tooltips.uniqueIndividuals")
                }
              >
                {dataset.numberOfUniqueIndividuals !== undefined ? (
                  dataset.numberOfUniqueIndividuals.toLocaleString()
                ) : (
                  <NotProvided label={notProvidedLabel} />
                )}
              </MetadataField>
              <MetadataField
                label={t("ageRange")}
                icon={faCalendarAlt}
                tooltip={helpText?.["minTypicalAge"] ?? t("tooltips.ageRange")}
              >
                {dataset.minTypicalAge !== undefined ||
                dataset.maxTypicalAge !== undefined ? (
                  <>
                    {dataset.minTypicalAge ?? notAvailableLabel} -{" "}
                    {dataset.maxTypicalAge ?? notAvailableLabel} {t("years")}
                  </>
                ) : (
                  <NotProvided label={notProvidedLabel} />
                )}
              </MetadataField>
            </div>
          </div>
        </MetadataSection>
      )}

      <MetadataSection title={t("coverage")} icon={faGlobe}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-wrap gap-2 items-center relative group">
            <span className="font-medium shrink-0">
              {t("spatialCoverage")}:
            </span>
            {dataset.spatialCoverage && dataset.spatialCoverage.length > 0 ? (
              <Chips
                chips={dataset.spatialCoverage.map(
                  (coverage) =>
                    coverage.text || coverage.uri?.label || unknownLabel
                )}
                className="bg-primary/10 text-primary rounded-full py-1"
              />
            ) : (
              <NotProvided label={notProvidedLabel} />
            )}
            <Tooltip
              message={
                helpText?.["spatialCoverage"] ??
                t("tooltips.datasetSpatialCoverage")
              }
            />
          </div>
          <MetadataField
            label={t("temporalCoverage")}
            tooltip={
              helpText?.["temporalCoverage"] ??
              t("tooltips.datasetTemporalCoverage")
            }
          >
            {renderTemporalCoverage()}
          </MetadataField>
          <MetadataField
            label={t("temporalResolution")}
            tooltip={
              helpText?.["temporalResolution"] ??
              t("tooltips.temporalResolution")
            }
          >
            {dataset.temporalResolution || (
              <NotProvided label={notProvidedLabel} />
            )}
          </MetadataField>
          <MetadataField
            label={t("spatialResolution")}
            tooltip={
              helpText?.["spatialResolutionInMeters"] ??
              t("tooltips.spatialResolution")
            }
          >
            {dataset.spatialResolutionInMeters !== undefined ? (
              <>
                {dataset.spatialResolutionInMeters} {t("meters")}
              </>
            ) : (
              <NotProvided label={notProvidedLabel} />
            )}
          </MetadataField>
        </div>
      </MetadataSection>

      {((dataset.legalBasis && dataset.legalBasis.length > 0) ||
        (dataset.applicableLegislation &&
          dataset.applicableLegislation.length > 0) ||
        (dataset.purpose && dataset.purpose.length > 0) ||
        (dataset.personalData && dataset.personalData.length > 0)) && (
        <MetadataSection title={t("legalAndCompliance")} icon={faGavel}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">{t("legalBasis")}:</span>
              {dataset.legalBasis && dataset.legalBasis.length > 0 ? (
                <Chips
                  chips={dataset.legalBasis.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={helpText?.["legalBasis"] ?? t("tooltips.legalBasis")}
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">
                {t("applicableLegislation")}:
              </span>
              {dataset.applicableLegislation &&
              dataset.applicableLegislation.length > 0 ? (
                <Chips
                  chips={dataset.applicableLegislation.map(
                    (item) => item.label
                  )}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={
                  helpText?.["applicableLegislation"] ??
                  t("tooltips.datasetApplicableLegislation")
                }
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">{t("purpose")}:</span>
              {dataset.purpose && dataset.purpose.length > 0 ? (
                <Chips
                  chips={dataset.purpose.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={helpText?.["purpose"] ?? t("tooltips.purpose")}
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">
                {t("personalDataTypes")}:
              </span>
              {dataset.personalData && dataset.personalData.length > 0 ? (
                <Chips
                  chips={dataset.personalData.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={
                  helpText?.["personalData"] ?? t("tooltips.personalDataTypes")
                }
              />
            </div>
          </div>
        </MetadataSection>
      )}

      {(dataset.publisherNote ||
        (dataset.publisherType && dataset.publisherType.length > 0) ||
        (dataset.creators && dataset.creators.length > 0) ||
        (hasHealthTheme &&
          ((dataset.hdab && dataset.hdab.length > 0) ||
            dataset.trustedDataHolder !== undefined))) && (
        <MetadataSection
          title={t("publisherAndDataGovernance")}
          icon={faUserShield}
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 flex-wrap relative group">
              <FontAwesomeIcon
                icon={faNoteSticky}
                className="text-primary text-xs"
              />
              <span className="font-medium shrink-0">
                {t("publisherNote")}:
              </span>
              <span>
                {dataset.publisherNote || (
                  <NotProvided label={notProvidedLabel} />
                )}
              </span>
              <Tooltip
                message={
                  helpText?.["publisherNote"] ?? t("tooltips.publisherNote")
                }
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap relative group">
              <FontAwesomeIcon icon={faUser} className="text-primary text-xs" />
              <span className="font-medium shrink-0">
                {t("publisherType")}:
              </span>
              {dataset.publisherType && dataset.publisherType.length > 0 ? (
                <Chips
                  chips={dataset.publisherType.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={
                  helpText?.["publisherType"] ?? t("tooltips.publisherType")
                }
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap relative group">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-primary text-xs"
              />
              <span className="font-medium shrink-0">{t("creators")}:</span>
              {dataset.creators && dataset.creators.length > 0 ? (
                dataset.creators.map((agent, index) => (
                  <span key={index} className="flex items-center gap-1">
                    <span>
                      {agent.name}
                      {agent.email && (
                        <span className="ml-1 text-info">({agent.email})</span>
                      )}
                    </span>
                    {index < dataset.creators!.length - 1 && ","}
                  </span>
                ))
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={helpText?.["creators"] ?? t("tooltips.creators")}
              />
            </div>
            {hasHealthTheme && (
              <>
                <div className="flex items-center gap-2 relative group">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className={
                      dataset.trustedDataHolder ? "text-info" : "text-gray-400"
                    }
                  />
                  <span className="font-medium">{t("trustedDataHolder")}:</span>
                  <span
                    className={
                      dataset.trustedDataHolder ? "text-info font-medium" : ""
                    }
                  >
                    {dataset.trustedDataHolder !== undefined ? (
                      dataset.trustedDataHolder ? (
                        t("yes")
                      ) : (
                        t("no")
                      )
                    ) : (
                      <NotProvided label={notProvidedLabel} />
                    )}
                  </span>
                  <Tooltip
                    message={
                      helpText?.["trustedDataHolder"] ??
                      t("tooltips.trustedDataHolder")
                    }
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap relative group">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="text-primary text-xs"
                  />
                  <span className="font-medium shrink-0">
                    {t("healthDataAccessBody")}:
                  </span>
                  {dataset.hdab && dataset.hdab.length > 0 ? (
                    dataset.hdab.map((agent, index) => (
                      <span key={index} className="flex items-center gap-1">
                        <span>
                          {agent.name}
                          {agent.email && (
                            <span className="ml-1 text-info">
                              ({agent.email})
                            </span>
                          )}
                        </span>
                        {index < dataset.hdab!.length - 1 && ","}
                      </span>
                    ))
                  ) : (
                    <NotProvided label={notProvidedLabel} />
                  )}
                  <Tooltip
                    message={
                      helpText?.["hdab"] ?? t("tooltips.healthDataAccessBody")
                    }
                  />
                </div>
              </>
            )}
          </div>
        </MetadataSection>
      )}

      {hasHealthTheme &&
        ((dataset.codingSystem && dataset.codingSystem.length > 0) ||
          (dataset.codeValues && dataset.codeValues.length > 0)) && (
          <MetadataSection title={t("codingAndStandards")} icon={faCode}>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex flex-wrap gap-2 items-center relative group">
                <span className="font-medium shrink-0">
                  {t("codingSystems")}:
                </span>
                {dataset.codingSystem && dataset.codingSystem.length > 0 ? (
                  <Chips
                    chips={dataset.codingSystem.map((item) => item.label)}
                    className="bg-primary/10 text-primary rounded-full py-1"
                  />
                ) : (
                  <NotProvided label={notProvidedLabel} />
                )}
                <Tooltip
                  message={
                    helpText?.["codingSystem"] ?? t("tooltips.codingSystems")
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center relative group">
                <span className="font-medium shrink-0">{t("codeValues")}:</span>
                {dataset.codeValues && dataset.codeValues.length > 0 ? (
                  <Chips
                    chips={dataset.codeValues.map((item) => item.label)}
                    className="bg-primary/10 text-primary rounded-full py-1"
                  />
                ) : (
                  <NotProvided label={notProvidedLabel} />
                )}
                <Tooltip
                  message={helpText?.["codeValues"] ?? t("tooltips.codeValues")}
                />
              </div>
            </div>
          </MetadataSection>
        )}

      {hasHealthTheme &&
        dataset.retentionPeriod &&
        dataset.retentionPeriod.length > 0 && (
          <MetadataSection title={t("retentionPeriod")} icon={faClock}>
            <div className="flex flex-col gap-2 text-sm relative group">
              {dataset.retentionPeriod && dataset.retentionPeriod.length > 0 ? (
                dataset.retentionPeriod.map((period, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>
                      {period.start
                        ? formatDate(period.start)
                        : notAvailableLabel}{" "}
                      - {period.end ? formatDate(period.end) : indefiniteLabel}
                    </span>
                  </div>
                ))
              ) : (
                <NotProvided label={notProvidedLabel} />
              )}
              <Tooltip
                message={
                  helpText?.["retentionPeriod"] ?? t("tooltips.retentionPeriod")
                }
              />
            </div>
          </MetadataSection>
        )}

      {(!!dataset.homepage ||
        (!!dataset.documentation && dataset.documentation.length > 0) ||
        (!!dataset.isReferencedBy && dataset.isReferencedBy.length > 0)) && (
        <MetadataSection title={t("linksAndReferences")} icon={faLink}>
          <div className="flex flex-col gap-2 text-sm">
            {dataset.homepage && (
              <div className="flex items-center gap-2 flex-wrap relative group">
                <span className="font-medium shrink-0">{t("homepage")}:</span>
                <a
                  href={dataset.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info hover:text-hover-color hover:underline break-all"
                >
                  {dataset.homepage}
                </a>
                <Tooltip
                  message={helpText?.["homepage"] ?? t("tooltips.homepage")}
                />
              </div>
            )}
            {dataset.documentation && dataset.documentation.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap relative group">
                <span className="font-medium shrink-0">
                  {t("documentation")}:
                </span>
                {dataset.documentation.map((doc, index) => (
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
                <Tooltip
                  message={
                    helpText?.["documentation"] ?? t("tooltips.documentation")
                  }
                />
              </div>
            )}
            {dataset.isReferencedBy && dataset.isReferencedBy.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap relative group">
                <span className="font-medium shrink-0">
                  {t("referencedBy")}:
                </span>
                {dataset.isReferencedBy.map((ref, index) => (
                  <span key={index}>{ref}</span>
                ))}
                <Tooltip
                  message={
                    helpText?.["isReferencedBy"] ?? t("tooltips.referencedBy")
                  }
                />
              </div>
            )}
          </div>
        </MetadataSection>
      )}

      {(dataset.version || dataset.versionNotes || dataset.frequency) && (
        <MetadataSection title={t("versionInformation")} icon={faInfoCircle}>
          <div className="flex flex-col gap-2 text-sm">
            <MetadataField
              label={t("version")}
              tooltip={helpText?.["version"] ?? t("tooltips.version")}
            >
              {dataset.version || <NotProvided label={notProvidedLabel} />}
            </MetadataField>
            <MetadataField
              label={t("updateFrequency")}
              tooltip={
                helpText?.["frequency"] ?? t("tooltips.datasetUpdateFrequency")
              }
            >
              {dataset.frequency?.label || (
                <NotProvided label={notProvidedLabel} />
              )}
            </MetadataField>
            <div className="flex items-center gap-2 flex-wrap relative group">
              <span className="font-medium shrink-0">{t("versionNotes")}:</span>
              <span>
                {dataset.versionNotes || (
                  <NotProvided label={notProvidedLabel} />
                )}
              </span>
              <Tooltip
                message={
                  helpText?.["versionNotes"] ?? t("tooltips.versionNotes")
                }
              />
            </div>
          </div>
        </MetadataSection>
      )}

      {hasHealthTheme && analytics.length > 0 && (
        <MetadataSection title={t("analytics")} icon={faChartBar}>
          <div className="relative group">
            {analytics.length > 0 ? (
              <Chips
                chips={analytics}
                className="bg-primary/10 text-primary rounded-full py-1"
              />
            ) : (
              <NotProvided label={notProvidedLabel} />
            )}
            <Tooltip
              message={helpText?.["analytics"] ?? t("tooltips.analytics")}
            />
          </div>
        </MetadataSection>
      )}

      {dataset.inSeries && dataset.inSeries.length > 0 && (
        <MetadataSection title={t("dataSeries")} icon={faLayerGroup}>
          <DataSeriesAccordion series={dataset.inSeries} />
        </MetadataSection>
      )}

      {dataset.distributions && dataset.distributions.length > 0 && (
        <MetadataSection title={t("distributions")} icon={faFile}>
          <DistributionAccordion distributions={dataset.distributions} />
        </MetadataSection>
      )}
    </>
  );
};

export default DatasetMetadata;
