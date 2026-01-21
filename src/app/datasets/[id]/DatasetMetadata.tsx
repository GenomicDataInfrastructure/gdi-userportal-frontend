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
  faInfoCircle,
  faUserShield,
  faNoteSticky,
  faCheckCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import DistributionAccordion from "./DistributionAccordion";
import Link from "next/link";
import Tooltip from "./Tooltip";
import Chips from "@/components/Chips";
import {
  DatasetDictionaryEntry,
  DatasetRelationEntry,
  RetrievedDataset,
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

const NotProvided = () => <span className="text-primary">Not provided</span>;

const isHealthDcatApCompatible = (dataset: RetrievedDataset): boolean => {
  const healthDcatApIndicators = [
    dataset.healthTheme && dataset.healthTheme.length > 0,
    dataset.healthCategory && dataset.healthCategory.length > 0,
    dataset.hdab && dataset.hdab.length > 0,
    dataset.trustedDataHolder !== undefined,
    dataset.legalBasis && dataset.legalBasis.length > 0,
    dataset.applicableLegislation && dataset.applicableLegislation.length > 0,
    dataset.purpose && dataset.purpose.length > 0,
    dataset.personalData && dataset.personalData.length > 0,
    dataset.codingSystem && dataset.codingSystem.length > 0,
    dataset.codeValues && dataset.codeValues.length > 0,
    dataset.populationCoverage,
    dataset.numberOfRecords !== undefined,
    dataset.numberOfUniqueIndividuals !== undefined,
    dataset.minTypicalAge !== undefined,
    dataset.maxTypicalAge !== undefined,
    dataset.publisherType && dataset.publisherType.length > 0,
    dataset.publisherNote,
    dataset.retentionPeriod && dataset.retentionPeriod.length > 0,
  ];

  return healthDcatApIndicators.some((indicator) => indicator);
};

const DatasetMetadata = ({
  dataset,
  relationships,
  dictionary,
}: {
  dataset: RetrievedDataset;
  relationships: DatasetRelationEntry[];
  dictionary: DatasetDictionaryEntry[];
}) => {
  const [userTimezone, setUserTimezone] = useState<string | null>(null);

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
              Created on {formatDate(dataset.createdAt)}
            </span>
            <Tooltip message="Date when the dataset was created." />
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
              Modified on {formatDate(dataset.modifiedAt)}
            </span>
            <Tooltip message="Date when the dataset was last modified." />
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
                Languages:{" "}
                {dataset.languages.map((lang) => lang.label).join(", ")}
              </span>
              <Tooltip message="Languages in which the dataset is available." />
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
                <span className="align-middle">Published by</span>
                {dataset.publishers.map((publisher, index) => (
                  <span key={publisher.name}>
                    <Link
                      href={`/datasets?page=1&ckan-publisher_name=${publisher.name}`}
                    >
                      {publisher.name || "No title"}
                    </Link>
                    {index < dataset.publishers!.length - 1 && ", "}
                  </span>
                ))}
              </span>
              <Tooltip message="Publishers to which the dataset belongs." />
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
                Access rights:{" "}
                {dataset.accessRights.label || "No access rights information."}
              </span>
              <Tooltip message="Information about access rights to the dataset." />
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
                Identifier: {dataset.identifier}
              </span>
              <Tooltip message="Unique identifier for the dataset." />
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
                {dataset.distributions.length === 1
                  ? "1 Distribution"
                  : `${dataset.distributions.length} Distributions`}
              </span>
              <Tooltip message="Number of distributions available for the dataset." />
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
                Type: {dataset.dcatType.label}
              </span>
              <Tooltip message="The type of the dataset" />
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
            <span className="align-middle">Keywords:</span>
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
            <Tooltip message="Keywords associated with the dataset." />
          </span>
        </div>
      )}
      {relationships && relationships.length > 0 && (
        <div className="flex flex-col mt-4 space-y-2">
          <div className="flex flex-col gap-1">
            {relationships.map((relationship, index) => (
              <div
                key={index}
                className="inline-flex bg-[#EFFAFE] px-4 py-1 rounded-full text-gray font-medium text-[14px] group relative"
              >
                <Link
                  href={`/@${dataset.publishers?.map((p) => p.name).join(",")}/${relationship.target}`}
                  className="group-hover:text-red hover:font-bold"
                >
                  <FontAwesomeIcon
                    icon={faTag}
                    className="align-middle text-primary"
                  />
                  <span className="align-middle">
                    {relationship.relation}: {relationship.target}
                  </span>
                </Link>
                <Tooltip message="Related dataset information." />
              </div>
            ))}
          </div>
        </div>
      )}
      {dictionary && dictionary.length > 0 && (
        <div className="mt-4">
          <h2 className="text-[18px] font-semibold py-2.5">
            Dataset Dictionary
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
                <Tooltip message="Information about the field." />
              </div>
            ))}
          </div>
        </div>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        (dataset.healthTheme && dataset.healthTheme.length > 0) ||
        (dataset.healthCategory && dataset.healthCategory.length > 0)) && (
        <MetadataSection title="Health Information" icon={faHeartPulse}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">Health Themes:</span>
              {dataset.healthTheme && dataset.healthTheme.length > 0 ? (
                <Chips
                  chips={dataset.healthTheme.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Health-related themes or topics covered by this dataset." />
            </div>
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">Health Categories:</span>
              {dataset.healthCategory && dataset.healthCategory.length > 0 ? (
                <Chips
                  chips={dataset.healthCategory.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Health data categories this dataset belongs to." />
            </div>
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        dataset.populationCoverage ||
        dataset.numberOfRecords !== undefined ||
        dataset.numberOfUniqueIndividuals !== undefined ||
        dataset.minTypicalAge !== undefined ||
        dataset.maxTypicalAge !== undefined) && (
        <MetadataSection title="Population & Demographics" icon={faUsers}>
          <div className="flex flex-col gap-3 text-sm">
            <MetadataField
              label="Population Coverage"
              tooltip="Description of the population covered by this dataset."
            >
              {dataset.populationCoverage || <NotProvided />}
            </MetadataField>
            <div className="flex items-center gap-4 flex-wrap">
              <MetadataField
                label="Number of Records"
                icon={faChartBar}
                tooltip="Total number of records in the dataset."
              >
                {dataset.numberOfRecords !== undefined ? (
                  dataset.numberOfRecords.toLocaleString()
                ) : (
                  <NotProvided />
                )}
              </MetadataField>
              <MetadataField
                label="Unique Individuals"
                icon={faUsers}
                tooltip="Number of unique individuals represented in the dataset."
              >
                {dataset.numberOfUniqueIndividuals !== undefined ? (
                  dataset.numberOfUniqueIndividuals.toLocaleString()
                ) : (
                  <NotProvided />
                )}
              </MetadataField>
              <MetadataField
                label="Age Range"
                icon={faCalendarAlt}
                tooltip="Typical age range of individuals in the dataset."
              >
                {dataset.minTypicalAge !== undefined ||
                dataset.maxTypicalAge !== undefined ? (
                  <>
                    {dataset.minTypicalAge ?? "N/A"} -{" "}
                    {dataset.maxTypicalAge ?? "N/A"} years
                  </>
                ) : (
                  <NotProvided />
                )}
              </MetadataField>
            </div>
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        (dataset.spatialCoverage && dataset.spatialCoverage.length > 0) ||
        (dataset.temporalCoverage &&
          (dataset.temporalCoverage.start || dataset.temporalCoverage.end)) ||
        dataset.temporalResolution ||
        dataset.spatialResolutionInMeters !== undefined) && (
        <MetadataSection title="Coverage" icon={faGlobe}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">Spatial Coverage:</span>
              {dataset.spatialCoverage && dataset.spatialCoverage.length > 0 ? (
                <Chips
                  chips={dataset.spatialCoverage.map(
                    (coverage) =>
                      coverage.text || coverage.uri?.label || "Unknown"
                  )}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Geographic regions covered by this dataset." />
            </div>
            <MetadataField
              label="Temporal Coverage"
              tooltip="Time period covered by the data in this dataset."
            >
              {dataset.temporalCoverage &&
              (dataset.temporalCoverage.start ||
                dataset.temporalCoverage.end) ? (
                <>
                  {dataset.temporalCoverage.start
                    ? formatDate(dataset.temporalCoverage.start)
                    : "N/A"}{" "}
                  -{" "}
                  {dataset.temporalCoverage.end
                    ? formatDate(dataset.temporalCoverage.end)
                    : "Present"}
                </>
              ) : (
                <NotProvided />
              )}
            </MetadataField>
            <MetadataField
              label="Temporal Resolution"
              tooltip="Minimum time period resolvable in the dataset."
            >
              {dataset.temporalResolution || <NotProvided />}
            </MetadataField>
            <MetadataField
              label="Spatial Resolution"
              tooltip="Minimum spatial separation resolvable in the dataset, measured in meters."
            >
              {dataset.spatialResolutionInMeters !== undefined ? (
                <>{dataset.spatialResolutionInMeters} meters</>
              ) : (
                <NotProvided />
              )}
            </MetadataField>
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        (dataset.legalBasis && dataset.legalBasis.length > 0) ||
        (dataset.applicableLegislation &&
          dataset.applicableLegislation.length > 0) ||
        (dataset.purpose && dataset.purpose.length > 0) ||
        (dataset.personalData && dataset.personalData.length > 0)) && (
        <MetadataSection title="Legal & Compliance" icon={faGavel}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">Legal Basis:</span>
              {dataset.legalBasis && dataset.legalBasis.length > 0 ? (
                <Chips
                  chips={dataset.legalBasis.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Legal basis under which this dataset is processed." />
            </div>
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">
                Applicable Legislation:
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
                <NotProvided />
              )}
              <Tooltip message="Legislation applicable to this dataset." />
            </div>
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">Purpose:</span>
              {dataset.purpose && dataset.purpose.length > 0 ? (
                <Chips
                  chips={dataset.purpose.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Purpose for which the data was collected or is being processed." />
            </div>
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">Personal Data Types:</span>
              {dataset.personalData && dataset.personalData.length > 0 ? (
                <Chips
                  chips={dataset.personalData.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Types of personal data contained in this dataset." />
            </div>
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        dataset.publisherNote ||
        (dataset.publisherType && dataset.publisherType.length > 0) ||
        (dataset.hdab && dataset.hdab.length > 0) ||
        dataset.trustedDataHolder !== undefined) && (
        <MetadataSection
          title="Publisher & Data Governance"
          icon={faUserShield}
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 flex-wrap relative group">
              <FontAwesomeIcon
                icon={faNoteSticky}
                className="text-primary text-xs"
              />
              <span className="font-medium shrink-0">Publisher Note:</span>
              <span>{dataset.publisherNote || <NotProvided />}</span>
              <Tooltip message="Additional notes from the data publisher." />
            </div>
            <div className="flex items-center gap-2 flex-wrap relative group">
              <FontAwesomeIcon icon={faUser} className="text-primary text-xs" />
              <span className="font-medium shrink-0">Publisher Type:</span>
              {dataset.publisherType && dataset.publisherType.length > 0 ? (
                <Chips
                  chips={dataset.publisherType.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Type of organization publishing this dataset." />
            </div>
            <div className="flex items-center gap-2 relative group">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className={
                  dataset.trustedDataHolder ? "text-info" : "text-gray-400"
                }
              />
              <span className="font-medium">Trusted Data Holder:</span>
              <span
                className={
                  dataset.trustedDataHolder ? "text-info font-medium" : ""
                }
              >
                {dataset.trustedDataHolder !== undefined ? (
                  dataset.trustedDataHolder ? (
                    "Yes"
                  ) : (
                    "No"
                  )
                ) : (
                  <NotProvided />
                )}
              </span>
              <Tooltip message="Indicates whether the data holder is a trusted entity." />
            </div>
            <div className="flex items-center gap-2 flex-wrap relative group">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-primary text-xs"
              />
              <span className="font-medium shrink-0">
                Health Data Access Body (HDAB):
              </span>
              {dataset.hdab && dataset.hdab.length > 0 ? (
                dataset.hdab.map((agent, index) => (
                  <span key={index} className="flex items-center gap-1">
                    <span>
                      {agent.name}
                      {agent.email && (
                        <span className="ml-1 text-info">({agent.email})</span>
                      )}
                    </span>
                    {index < dataset.hdab!.length - 1 && ","}
                  </span>
                ))
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Health Data Access Body responsible for granting access to this dataset." />
            </div>
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        (dataset.codingSystem && dataset.codingSystem.length > 0) ||
        (dataset.codeValues && dataset.codeValues.length > 0)) && (
        <MetadataSection title="Coding & Standards" icon={faCode}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">Coding Systems:</span>
              {dataset.codingSystem && dataset.codingSystem.length > 0 ? (
                <Chips
                  chips={dataset.codingSystem.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Coding systems or standards used in this dataset (e.g., ICD-10, SNOMED CT)." />
            </div>
            <div className="flex flex-wrap gap-2 items-center relative group">
              <span className="font-medium shrink-0">Code Values:</span>
              {dataset.codeValues && dataset.codeValues.length > 0 ? (
                <Chips
                  chips={dataset.codeValues.map((item) => item.label)}
                  className="bg-primary/10 text-primary rounded-full py-1"
                />
              ) : (
                <NotProvided />
              )}
              <Tooltip message="Specific code values used within the coding systems." />
            </div>
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        (dataset.retentionPeriod && dataset.retentionPeriod.length > 0)) && (
        <MetadataSection title="Retention Period" icon={faClock}>
          <div className="flex flex-col gap-2 text-sm relative group">
            {dataset.retentionPeriod && dataset.retentionPeriod.length > 0 ? (
              dataset.retentionPeriod.map((period, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>
                    {period.start ? formatDate(period.start) : "N/A"} -{" "}
                    {period.end ? formatDate(period.end) : "Indefinite"}
                  </span>
                </div>
              ))
            ) : (
              <NotProvided />
            )}
            <Tooltip message="Period during which the data will be retained." />
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        dataset.homepage ||
        dataset.uri ||
        (dataset.documentation && dataset.documentation.length > 0) ||
        (dataset.isReferencedBy && dataset.isReferencedBy.length > 0)) && (
        <MetadataSection title="Links & References" icon={faLink}>
          <div className="flex flex-col gap-2 text-sm">
            {dataset.homepage && (
              <div className="flex items-center gap-2 flex-wrap relative group">
                <span className="font-medium shrink-0">Homepage:</span>
                <a
                  href={dataset.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info hover:text-hover-color hover:underline break-all"
                >
                  {dataset.homepage}
                </a>
                <Tooltip message="Homepage URL for more information about this dataset." />
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap relative group">
              <span className="font-medium shrink-0">URI:</span>
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
                <NotProvided />
              )}
              <Tooltip message="Unique Resource Identifier for this dataset." />
            </div>
            {dataset.documentation && dataset.documentation.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap relative group">
                <span className="font-medium shrink-0">Documentation:</span>
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
                <Tooltip message="Links to documentation about this dataset." />
              </div>
            )}
            {dataset.isReferencedBy && dataset.isReferencedBy.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap relative group">
                <span className="font-medium shrink-0">Referenced By:</span>
                {dataset.isReferencedBy.map((ref, index) => (
                  <span key={index}>{ref}</span>
                ))}
                <Tooltip message="Resources that reference this dataset." />
              </div>
            )}
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        dataset.version ||
        dataset.versionNotes ||
        dataset.frequency) && (
        <MetadataSection title="Version Information" icon={faInfoCircle}>
          <div className="flex flex-col gap-2 text-sm">
            <MetadataField
              label="Version"
              tooltip="Version number or designation of this dataset."
            >
              {dataset.version || <NotProvided />}
            </MetadataField>
            <MetadataField
              label="Update Frequency"
              tooltip="How often the dataset is updated."
            >
              {dataset.frequency?.label || <NotProvided />}
            </MetadataField>
            <div className="flex items-center gap-2 flex-wrap relative group">
              <span className="font-medium shrink-0">Version Notes:</span>
              <span>{dataset.versionNotes || <NotProvided />}</span>
              <Tooltip message="Notes about this version of the dataset." />
            </div>
          </div>
        </MetadataSection>
      )}

      {(isHealthDcatApCompatible(dataset) ||
        (dataset.analytics && dataset.analytics.length > 0)) && (
        <MetadataSection title="Analytics" icon={faChartBar}>
          <div className="relative group">
            {dataset.analytics && dataset.analytics.length > 0 ? (
              <Chips
                chips={dataset.analytics}
                className="bg-primary/10 text-primary rounded-full py-1"
              />
            ) : (
              <NotProvided />
            )}
            <Tooltip message="Analytics capabilities or methods available for this dataset." />
          </div>
        </MetadataSection>
      )}

      {dataset.distributions && dataset.distributions.length > 0 && (
        <div className="mt-4">
          <DistributionAccordion distributions={dataset.distributions} />
        </div>
      )}
    </>
  );
};

export default DatasetMetadata;
