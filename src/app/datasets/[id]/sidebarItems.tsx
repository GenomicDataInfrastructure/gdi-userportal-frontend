// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AddToBasketButton from "@/components/AddToBasketButton";
import { SidebarItem } from "@/components/Sidebar";
import {
  ContactPointsSidebarTranslations,
  createContactPointsSidebarItem,
} from "@/components/ContactPointsSidebarItem";
import ExportDatasetButton from "@/app/datasets/[id]/ExportDatasetButton";
import { RetrievedDataset } from "@/app/api/discovery/open-api/schemas";
import {
  getFirstAccessUrl,
  getExternalDatasetInfo,
} from "@/utils/datasetHelpers";
import ExternalDatasetLink from "./ExternalDatasetLink";

type DatasetSidebarTranslations = ContactPointsSidebarTranslations & {
  requestDataAccess: string;
  externalRequestUnavailable: string;
  externalRequestPortal: string;
  noExternalLinkAvailable: string;
  exportMetadataIn: string;
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
      style: { backgroundColor: "var(--color-secondary)", color: "black" },
    },
  ];

  return [
    {
      label: t.requestDataAccess,
      value: (
        <AddToBasketButton
          dataset={{
            ...dataset,
            distributionsCount: dataset.distributions?.length,
          }}
          withoutAccessContent={
            externalInfo.isExternal ? (
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
            ) : undefined
          }
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
    createContactPointsSidebarItem(dataset.contacts, t),
  ];
}

export { createDatasetSidebarItems };
