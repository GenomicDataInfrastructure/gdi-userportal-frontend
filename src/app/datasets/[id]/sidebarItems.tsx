// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  SidebarItem,
  createTextItem,
  createLinkItem,
  createLinkItems,
} from "@/components/Sidebar";
import { RetrievedDataset } from "@/services/discovery/types/dataset.types";
import { formatDate } from "@/utils/formatDate";

function createDatasetSidebarItems(dataset: RetrievedDataset): SidebarItem[] {
  return [
    {
      label: "Metadata Created",
      value: dataset.createdAt && (
        <span className="font-date">{formatDate(dataset.createdAt)}</span>
      ),
    },
    {
      label: "Metadata Modified",
      value: dataset.modifiedAt && (
        <span className="font-date">{formatDate(dataset.modifiedAt)}</span>
      ),
    },
    {
      label: "Source",
      value: createLinkItem({ label: dataset.url, url: dataset.url }),
    },
    {
      label: "Language",
      value: createLinkItems(
        dataset.languages?.map((language) => ({
          label: language.label,
          url: language.value,
        }))
      ),
    },
    {
      label: "Publisher",
      value: createTextItem(dataset.publisherName),
    },
    {
      label: "Identifier",
      value: createTextItem(dataset.identifier),
    },
    {
      label: "Spatial URI",
      value: createLinkItem({
        label: dataset.spatial?.label,
        url: dataset.spatial?.value,
      }),
    },
    {
      label: "Has Version",
      value: createLinkItems(
        dataset.hasVersions?.map((version) => ({
          label: version.label,
          url: version.value,
        }))
      ),
    },
    {
      label: "Contact URI",
      value: createLinkItem({
        label: dataset.contact?.label,
        url: dataset.contact?.value,
      }),
    },
    {
      label: "Access rights",
      value: createLinkItem({
        label: dataset.accessRights?.label,
        url: dataset.accessRights?.value,
      }),
    },
    {
      label: "Conforms to",
      value: createLinkItems(
        dataset.conformsTo?.map((conform) => ({
          label: conform.label,
          url: conform.value,
        }))
      ),
    },
    {
      label: "Provenance",
      value: createTextItem(dataset.provenance),
    },
  ];
}

export { createDatasetSidebarItems };
