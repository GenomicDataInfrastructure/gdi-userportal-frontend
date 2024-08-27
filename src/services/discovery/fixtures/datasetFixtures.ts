// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export const retrivedDatasetFixture = {
  id: "a9dc55a2-a6d8-4553-ad6a-afe9c52f89cd",
  identifier: "1",
  title: "Dataset Name",
  description: "description",
  themes: [
    {
      value: "value",
      label: "label",
    },
  ],
  publisherName: "Publisher",
  organization: "Organization",
  createdAt: "12-1-2023",
  modifiedAt: "02-02-2024",
  url: "url",
  languages: [
    {
      label: "en",
      value: "English",
    },
  ],
  hasVersions: [
    {
      value: "1",
      label: "one",
    },
  ],
  accessRights: [
    {
      label: "Public",
      value: "public",
    },
  ],
  conformsTo: [],
  provenance: "prov",
  spatial: { label: "spatial", value: "spatial" },
  distributions: [
    {
      id: "dist-id",
      title: "dist",
      description: "dist desc",
      format: { value: "format", label: "format" },
      createdAt: "12-01-2023",
      modifiedAt: "02-02-2024",
    },
  ],
  keywords: [
    {
      label: "organization",
      value: "umcg",
    },
  ],
};

export const searchedDatasetFixture = {
  id: "id",
  title: "title",
  identifier: "Dataset Identifier",
  description: "desc",
  themes: [
    {
      value: "value",
      label: "label",
    },
  ],
  organization: "umcg",
  modifiedAt: "12-01-2023",
  createdAt: "02-02-2024",
};
