// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SidebarItem, SidebarLink } from '@/components/Sidebar';
import { Dataset } from '@/types/dataset.types';
import formatDatasetLanguage from '@/utils/formatDatasetLanguage';
import { formatDate } from '@/utils/formatDate';

function createDatasetSidebarItems(dataset: Dataset): SidebarItem[] {
  return [
    {
      label: 'Metadata Created',
      value: dataset.metadataCreated && formatDate(dataset.metadataCreated),
      isLink: false,
    },
    {
      label: 'Metadata Modified',
      value: dataset.metadataModified && formatDate(dataset.metadataModified),
      isLink: false,
    },
    {
      label: 'Source',
      value: {
        label: dataset.url,
        url: dataset.url,
      },
      isLink: true,
    },
    {
      label: 'Language',
      value: dataset.languages.map((language) => {
        return { label: formatDatasetLanguage(language), url: language } as SidebarLink;
      }),
      isLink: true,
    },
    {
      label: 'Publisher Name',
      value: dataset.publisher.name,
      isLink: false,
    },
    {
      label: 'Identifier',
      value: {
        label: dataset.identifier,
        url: dataset.identifier,
      },
      isLink: true,
    },
    {
      label: 'Spatial URI',
      value: {
        label: dataset.spatialUri,
        url: dataset.spatialUri,
      },
      isLink: true,
    },
    {
      label: 'Has Version',
      value: dataset.version.hasVersion,
      isLink: false,
    },
    {
      label: 'Contact URI',
      value: dataset.contact.contactUri,
      isLink: false,
    },
    {
      label: 'Access rights',
      value: dataset.accessRights,
      isLink: false,
    },
    {
      label: 'Conforms to',
      value: dataset.conformsTo,
      isLink: false,
    },
    {
      label: 'Provenance',
      value: dataset.provenance,
      isLink: false,
    },
  ];
}

export { createDatasetSidebarItems };
