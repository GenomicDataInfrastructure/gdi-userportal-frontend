// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { Dataset } from "@/types/dataset.types";
import formatDatasetLanguage from "@/utils/formatDatasetLanguage";
import { formatDate } from "@/utils/formatDate";

interface SidebarProps {
  dataset: Dataset;
}

const Sidebar = ({ dataset }: SidebarProps) => {
  return (
    <div className="flex w-full flex-col gap-3 rounded bg-secondary p-5 text-white lg:w-1/3">
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Metadata Created
        </h3>
        <span className="text-sm sm:text-base lg:text-lg">
          {dataset.metadataCreated && formatDate(dataset.metadataCreated)}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Metadata Modified
        </h3>
        <span className="text-sm sm:text-base lg:text-lg">
          {dataset.metadataCreated && formatDate(dataset.metadataModified)}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">Source</h3>
        <span className="break-words text-sm sm:text-base lg:text-lg">
          <a
            href={dataset.url}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {dataset.url}
          </a>
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Language
        </h3>
        <span className="break-words text-sm sm:text-base lg:text-lg">
          {dataset.languages.map((language, index) => (
            <a
              href={language}
              key={index}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {formatDatasetLanguage(language)}
            </a>
          ))}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Publisher Name
        </h3>
        <span className="text-sm sm:text-base lg:text-lg">
          {dataset.publisher.name}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Identifier
        </h3>
        <span className="break-words text-sm sm:text-base lg:text-lg">
          <a
            href={dataset.identifier}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {dataset.identifier}
          </a>
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Spatial URI
        </h3>
        <span className="break-words text-sm sm:text-base lg:text-lg">
          <a
            href={dataset.spatialUri}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {dataset.spatialUri}
          </a>
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Has Version
        </h3>
        <span className="text-sm sm:text-base lg:text-lg">
          {dataset.version.hasVersion}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Contact URI
        </h3>
        <span className="break-words text-sm sm:text-base lg:text-lg">
          {dataset.contact.contactUri}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Access rights
        </h3>
        <span className="break-words text-sm sm:text-base lg:text-lg">
          {dataset.accessRights}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Conforms to
        </h3>
        <span className="break-words text-sm sm:text-base lg:text-lg">
          {dataset.conformsTo}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="text-base text-warning sm:text-lg lg:text-xl">
          Provenance
        </h3>
        <span className="text-sm sm:text-base lg:text-lg">
          {dataset.provenance}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
