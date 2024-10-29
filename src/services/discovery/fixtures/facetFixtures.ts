// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export const filterFixtures = {
  data: [
    {
      source: "ckan",
      type: "DROPDOWN",
      key: "access_rights",
      label: "Access Rights",
      values: [
        {
          value:
            "https://staging-fdp.gdi.nbis.se/dataset/87495812-3201-4099-9478-1c60c9ef8c85#accessRights",
          label:
            "https://staging-fdp.gdi.nbis.se/dataset/87495812-3201-4099-9478-1c60c9ef8c85#accessRights",
        },
        {
          value:
            "https://publications.europa.eu/resource/authority/access-right/RESTRICTED",
          label: "Restricted",
        },
      ],
    },
    {
      source: "ckan",
      type: "DROPDOWN",
      key: "theme",
      label: "Themes",
      values: [
        {
          value:
            "https://publications.europa.eu/resource/authority/data-theme/TECH",
          label: "Science and technology",
        },
        {
          value: "https://gdi.onemilliongenomes.eu",
          label: "GDI",
        },
        {
          value: "https://en.wikipedia.org/wiki/Colorectal_cancer",
          label: "Colorectal cancer",
        },
        {
          value:
            "https://publications.europa.eu/resource/authority/data-theme/HEAL",
          label: "Health",
        },
      ],
    },
    {
      source: "beacon",
      type: "DROPDOWN",
      key: "Human Phenotype Ontology",
      label: "Human Phenotype Ontology",
      values: [
        {
          value: "Motor delay",
          label: "Delay",
        },
      ],
    },
  ],
};
