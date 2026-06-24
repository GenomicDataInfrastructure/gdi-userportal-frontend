// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AddToBasketButton from "@/components/AddToBasketButton";
import { SidebarItem } from "@/components/Sidebar";
import contentConfig from "@/config/contentConfig";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExportDatasetButton from "@/app/datasets/[id]/ExportDatasetButton";
import { RetrievedDataset } from "@/app/api/discovery/open-api/schemas";
import {
  getFirstAccessUrl,
  getExternalDatasetInfo,
} from "@/utils/datasetHelpers";
import ExternalDatasetLink from "./ExternalDatasetLink";

type DatasetSidebarTranslations = {
  requestDataAccess: string;
  externalRequestUnavailable: string;
  externalRequestPortal: string;
  noExternalLinkAvailable: string;
  exportMetadataIn: string;
  contactPoints: string;
  noContactProvided: string;
  noEmailProvided: string;
};

function createDatasetSidebarItems(
  dataset: RetrievedDataset,
  t: DatasetSidebarTranslations
): SidebarItem[] {
  const externalInfo = getExternalDatasetInfo(dataset);
  const externalAccessUrl = getFirstAccessUrl(dataset.distributions);
  const metaFormats = [
    {
      format: "rdf",
      label: "RDF",
      style: {
        backgroundColor: "var(--color-warning)",
        ":hover": { backgroundColor: "var(--color-hover)" },
      },
    },
    {
      format: "ttl",
      label: "TTL",
      style: { backgroundColor: "var(--color-info)", color: "white" },
    },
    {
      format: "jsonld",
      label: "JSON-LD",
      style: { backgroundColor: "var(--color-secondary)", color: "white" },
    },
  ];

  return [
    {
      label: t.requestDataAccess,
      value: externalInfo.isExternal ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-600">
            {t.externalRequestUnavailable}
            {externalAccessUrl ? ` ${t.externalRequestPortal}` : ""}
          </p>
          {externalAccessUrl ? (
            <ExternalDatasetLink url={externalAccessUrl} />
          ) : (
            <span className="text-xs px-3 py-2 font-semibold bg-gray-200 text-gray-600 rounded-md w-fit">
              {t.noExternalLinkAvailable}
            </span>
          )}
        </div>
      ) : (
        <AddToBasketButton
          dataset={{
            ...dataset,
            distributionsCount: dataset.distributions?.length,
          }}
        />
      ),
      hideItem: !!dataset.isSeries,
    },
    {
      label: t.exportMetadataIn,
      value: (
        <div className="flex gap-2 transition py-2 sm:py-0">
          {metaFormats.map((item) => (
            <ExportDatasetButton
              key={item.format}
              datasetId={dataset.id}
              item={item}
            />
          ))}
        </div>
      ),
    },
    {
      label: t.contactPoints,
      value: (
        <div className="flex items-center text-[14px]">
          <div className="flex flex-col gap-1">
            {dataset.contacts?.length === 0 ? (
              <>
                <div className="flex gap-8 items-center">
                  <FontAwesomeIcon icon={faUser} className="text-primary" />
                  <p>{t.noContactProvided}</p>
                </div>
                <div className="flex gap-8 items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                  <p>{t.noEmailProvided}</p>
                </div>
              </>
            ) : (
              dataset.contacts?.map((contact, index) => (
                <div key={index}>
                  <div className="flex gap-8 items-center">
                    <FontAwesomeIcon icon={faUser} className="text-primary" />
                    <p>{contact.name || t.noContactProvided}</p>
                  </div>
                  <div
                    key={`${index}-email`}
                    className="flex gap-8 items-center"
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-primary"
                    />
                    <p>{contact.email || t.noEmailProvided}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ),
    },
  ];
}

export { createDatasetSidebarItems };
