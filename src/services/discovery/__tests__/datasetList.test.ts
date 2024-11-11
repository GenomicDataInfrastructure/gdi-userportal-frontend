// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import axios from "axios";
import { makeDatasetList } from "../datasetList";
import { searchedDatasetFixture } from "../fixtures/datasetFixtures";
import { DatasetSearchOptions } from "@/services/discovery/types/datasetSearch.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const datasetList = makeDatasetList("https://mock-discovery-service.com");

describe("datasetList", () => {
  const mockApiResponse = {
    data: {
      count: 1,
      results: [searchedDatasetFixture],
      facetGroups: [],
    },
  };
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.post.mockClear();
  });

  test("maps and asserts the full server response", async () => {
    const response = await datasetList({}, null);

    expect(response.data.count).toEqual(1);
    const dataset = response.data.results[0];
    expect(dataset.id).toEqual("id");
    expect(dataset.title).toEqual("title");
    expect(dataset.description).toEqual("desc");
    expect(dataset.themes).toEqual([
      {
        value: "value",
        label: "label",
      },
    ]);
    expect(dataset.organization).toEqual("umcg");
    expect(dataset.modifiedAt).toEqual("12-01-2023");
    expect(dataset.createdAt).toEqual("02-02-2024");
    expect(dataset.identifier).toEqual("Dataset Identifier");
  });

  test("applies tag filters correctly", async () => {
    const facets = [
      {
        source: "ckan",
        type: "DROPDOWN",
        key: "tags",
        value: "education",
      },
      {
        source: "ckan",
        type: "DROPDOWN",
        key: "tags",
        value: "science",
      },
    ];
    const searchOptions = {
      facets,
      rows: 1,
    } as DatasetSearchOptions;

    const expectedBody = {
      rows: 1,
      facets: facets,
    };

    await datasetList(searchOptions, null);

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://mock-discovery-service.com/api/v1/datasets/search",
      expectedBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  });

  test("applies organization filters correctly", async () => {
    const searchOptions = {
      facets: [
        {
          source: "ckan",
          type: "DROPDOWN",
          key: "organization",
          value: "org1",
        },
        {
          source: "beacon",
          type: "DROPDOWN",
          key: "organization",
          value: "org-2",
        },
      ],
      rows: 1,
    } as DatasetSearchOptions;
    const expectedBody = {
      rows: 1,
      facets: [
        {
          source: "ckan",
          type: "DROPDOWN",
          key: "organization",
          value: "org1",
        },
        {
          source: "beacon",
          type: "DROPDOWN",
          key: "organization",
          value: "org-2",
        },
      ],
    };
    await datasetList(searchOptions, null);

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://mock-discovery-service.com/api/v1/datasets/search",
      expectedBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  });

  test("combines multiple filters correctly", async () => {
    const facets = [
      {
        source: "ckan",
        type: "DROPDOWN",
        key: "tags",
        value: "technology",
      },
      {
        source: "ckan",
        type: "DROPDOWN",
        key: "tags",
        value: "http://example.com/other-tag",
      },
      {
        source: "beacon",
        type: "DROPDOWN",
        key: "organization",
        value: "org-2",
      },
      {
        source: "ckan",
        type: "DROPDOWN",
        key: "publisher_name",
        value: "A random publisher",
      },
      {
        source: "ckan",
        type: "DROPDOWN",
        key: "organization",
        value: "org-1",
      },
      {
        source: "beacon",
        type: "DROPDOWN",
        key: "theme",
        value: "group-1",
      },
    ];

    const searchOptions = {
      facets: facets,
      rows: 2,
    };
    const expectedBody = {
      rows: 2,
      facets: facets,
    };

    await datasetList(searchOptions, null);

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://mock-discovery-service.com/api/v1/datasets/search",
      expectedBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  });
});
