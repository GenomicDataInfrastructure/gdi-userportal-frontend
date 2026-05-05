// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { searchDatasetsApi } from "@/app/api/discovery";
import AxiosMockAdapter from "axios-mock-adapter";
import { discoveryAxiosInstance } from "@/app/api/shared/client";
import { DatasetSearchQuery } from "@/app/api/discovery/open-api/schemas";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";

jest.mock("next-auth/next");
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Searching datasets", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(discoveryAxiosInstance);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Returns the relevant datasets for authenticated user", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/datasets/search").reply(200, {
      count: 1,
      results: [
        {
          id: "1",
          title: "Dataset 1",
          description: "Description of dataset 1",
        },
      ],
    });

    const options: DatasetSearchQuery = {};
    const response = await searchDatasetsApi(options);

    expect(response).toBeDefined();
    expect(response.count).toEqual(1);
  });

  test("maps publisherName facets to publisher_name and uses default relevance sort", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/datasets/search").reply((config) => {
      expect(config.data).toBeDefined();

      const body = JSON.parse(config.data as string);
      expect(body.sort).toBe("score desc, metadata_modified desc");
      expect(body.facets).toEqual([
        {
          source: "ckan",
          type: "DROPDOWN",
          key: "publisher_name",
          operator: "=",
          value: "LNDS",
        },
      ]);

      return [200, { count: 0, results: [] }];
    });

    const options: DatasetSearchQuery = {
      facets: [
        {
          source: "ckan",
          type: "DROPDOWN",
          key: "publisherName",
          value: "LNDS",
        },
      ],
    };

    const response = await searchDatasetsApi(options);

    expect(response).toEqual({ count: 0, results: [] });
  });

  test("maps returned facet keys to app-friendly keys", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/datasets/search").reply(200, {
      count: 0,
      results: [],
      facets: [
        {
          source: "ckan",
          type: "DROPDOWN",
          key: "publisher_name",
          label: "Publisher",
          values: [{ value: "LNDS", label: "LNDS", count: 1 }],
        },
      ],
    });

    const response = await searchDatasetsApi({});

    expect(response.facets).toEqual([
      {
        source: "ckan",
        type: "DROPDOWN",
        key: "publisherName",
        label: "Publisher",
        values: [{ value: "LNDS", label: "LNDS", count: 1 }],
      },
    ]);
  });
});
