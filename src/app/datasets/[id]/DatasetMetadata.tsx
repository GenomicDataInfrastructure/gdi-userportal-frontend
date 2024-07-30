// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faBuilding,
  faTag,
  faFile,
  faCalendarAlt,
  faKey,
  faLanguage,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import {
  RetrievedDataset,
  DatasetRelationship,
  DatasetDictionaryEntry,
} from "@/services/discovery/types/dataset.types";
import { formatRelationshipType } from "@/utils/datasetRelationshipUtils";
import {
  formatFieldName,
  formatDescription,
} from "@/utils/datasetDictionaryUtils";
import DistributionAccordion from "./DistributionAccordion";
import Link from "next/link";
import Tooltip from "./Tooltip";

const DatasetMetadata = ({
  dataset,
  relationships,
  dictionary,
}: {
  dataset: RetrievedDataset;
  relationships: DatasetRelationship[];
  dictionary: DatasetDictionaryEntry[];
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 font-[400] text-gray">
        {dataset.createdAt && (
          <span className="inline flex gap-2 items-center relative group">
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
          <span className="inline flex gap-2 items-center relative group">
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
        {dataset.catalogue && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="inline sm:flex-row flex flex-col gap-2 relative group">
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="align-middle text-primary"
                />
              </div>
              <div className="pl-5 sm:pl-0 lg:pl-0 flex items-center">
                <Link
                  href={`/datasets?page=1&ckan-organization=${dataset.catalogue.toLowerCase()}`}
                >
                  <h1 className="m-auto md:m-0 underline inline">
                    {dataset.catalogue || "No title."}
                  </h1>
                </Link>
              </div>
              <Tooltip message="Catalogue to which the dataset belongs." />
            </span>
          </>
        )}
        {dataset.accessRights && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="inline flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faTag}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                {dataset.accessRights.label || "No access rights information."}
              </span>
              <Tooltip message="Information about access rights to the dataset." />
            </span>
          </>
        )}
        {dataset.identifier && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="inline flex gap-2 items-center relative group">
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
        {dataset.languages?.length > 0 && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="inline flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faLanguage}
                className="align-middle text-primary"
              />
              <span className="align-middle">
                Languages:{" "}
                {dataset.languages?.map((lang) => lang.label).join(", ")}
              </span>
              <Tooltip message="Languages in which the dataset is available." />
            </span>
          </>
        )}
        {dataset.distributions?.length > 0 && (
          <>
            <div className="text-lightaccent hidden sm:inline-block">|</div>
            <span className="inline flex gap-2 items-center relative group">
              <FontAwesomeIcon
                icon={faFile}
                className="align-middle text-primary "
              />
              <span className="align-middle">
                {dataset.distributions.length} Distribution(s)
              </span>
              <Tooltip message="Number of distributions available for the dataset." />
            </span>
          </>
        )}
      </div>
      {dataset.keywords?.length > 0 && (
        <div className="mt-4">
          <span className="inline flex gap-2 items-center relative group">
            <FontAwesomeIcon
              icon={faKey}
              className="align-middle text-primary"
            />
            <span className="align-middle">Keywords:</span>
            <div className="flex flex-wrap gap-1">
              {dataset.keywords?.map((keyword) => (
                <span
                  className="bg-[var(--color-warning)] bg-opacity-50 px-4 py-1 rounded-2xl-md text-gray font-[500] text-[14px] inline-block"
                  key={keyword.value}
                >
                  {keyword.label}
                </span>
              ))}
            </div>
            <Tooltip message="Keywords associated with the dataset." />
          </span>
        </div>
      )}
      {relationships.length > 0 && (
        <div className="flex flex-col mt-4 space-y-2">
          <div className="flex flex-col gap-1">
            {relationships.map((relationship, index) => (
              <div
                key={index}
                className="inline-flex bg-[#EFFAFE] px-4 py-1 rounded-2xl-md text-gray font-[500] text-[14px] group relative"
              >
                <Link
                  href={`/@${dataset.catalogue}/${relationship.related_dataset}`}
                  className="group-hover:text-red hover:font-bold"
                >
                  <FontAwesomeIcon
                    icon={faTag}
                    className="align-middle text-primary"
                  />
                  <span className="align-middle">
                    {formatRelationshipType(relationship.relationship_type)}:{" "}
                    {relationship.related_dataset}
                  </span>
                </Link>
                <Tooltip message="Related dataset information." />
              </div>
            ))}
          </div>
        </div>
      )}
      {dictionary.length > 0 && (
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
                  {formatFieldName(entry.field_name)}
                </span>
                <span className="text-sm text-gray-800">
                  ({entry.data_type}):
                </span>
                <p className="text-sm font-normal text-gray text-[15px] m-0">
                  {formatDescription(entry.description)}
                </p>
                <Tooltip message="Information about the field." />
              </div>
            ))}
          </div>
        </div>
      )}
      <DistributionAccordion distributions={dataset.distributions || []} />
    </>
  );
};

export default DatasetMetadata;
