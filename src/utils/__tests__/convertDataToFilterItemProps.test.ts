// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Facet } from "@/services/discovery/types/facets.type";
import { convertDataToFilterItemProps } from "../convertDataToFilterItemProps";
import { FacetGroup } from "@/services/discovery/types/datasetSearch.types";

describe("Map field details objects to filter item props", () => {
  it("should map field details to filter item props", () => {
    const groupKey = "ckan";
    const facets = [
      {
        facetGroup: "ckan",
        key: "publisher_name",
        label: "Publishers",
        values: [
          { label: "publisherName", value: "adeling NKR-analyse" },
          { label: "publisherName", value: "Centro Nacional de Epidemiología" },
          {
            label: "publisherName",
            value: "sciensano Network of General Practitioners team",
          },
        ],
      },
      {
        facetGroup: "ckan",
        key: "organization",
        label: "Catalogues",
        values: [
          { label: "organization", value: "EU" },
          { label: "organization", value: "lumc" },
          { label: "organization", value: "Umcg" },
        ],
      },
    ] as Facet[];

    const expected = [
      {
        field: "publisher_name",
        label: "Publishers",
        groupKey: groupKey,
        data: [
          {
            label: "publisherName",
            value: "adeling NKR-analyse",
          },
          {
            label: "publisherName",
            value: "Centro Nacional de Epidemiología",
          },
          {
            label: "publisherName",
            value: "sciensano Network of General Practitioners team",
          },
        ],
      },
      {
        field: "organization",
        label: "Catalogues",
        groupKey: groupKey,
        data: [
          {
            label: "organization",
            value: "EU",
          },
          {
            label: "organization",
            value: "lumc",
          },
          {
            label: "organization",
            value: "Umcg",
          },
        ],
      },
    ];

    const result = convertDataToFilterItemProps(facets);

    expect(result).toEqual(expected);
  });
  it("should return object with empty data for facet with empty values", () => {
    const groupKey = "ckan";
    const facets = [
      {
        facetGroup: "ckan",
        key: "publisher_name",
        label: "Publishers",
        values: [],
      },
    ] as Facet[];

    const expected = [
      {
        field: "publisher_name",
        label: "Publishers",
        groupKey: groupKey,
        data: [],
      },
    ];

    const result = convertDataToFilterItemProps(facets);

    expect(result).toEqual(expected);
  });

  it("should return object with undefined icon if field of facet object is not in keys of fieldToIconMap object", () => {
    const facets = [
      {
        facetGroup: "",
        key: "publisher_name",
        label: "Publishers",
        values: [],
      },
    ];

    const expected = [
      {
        field: "publisher_name",
        label: "Publishers",
        groupKey: "",
        data: [],
      },
    ];

    const result = convertDataToFilterItemProps(facets);

    expect(result).toEqual(expected);
  });
});
