// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { retrieveDatasetApi } from "@/app/api/discovery";
import AxiosMockAdapter from "axios-mock-adapter";
import { discoveryAxiosInstance } from "@/app/api/shared/client";

describe("Retrieving a specific dataset", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(discoveryAxiosInstance);

  beforeEach(() => {
    mockDiscoveryAdapter.reset();
  });

  test("Returns the specific dataset ", async () => {
    mockDiscoveryAdapter.onGet("/api/v1/datasets/99").reply(200, {
      id: "99",
      title: "Dataset 99",
      description: "This is dataset 99",
    });

    const response = await retrieveDatasetApi("99");

    expect(response).toBeDefined();
    expect(response.id).toEqual("99");
  });

  test("accepts null data service fields returned by discovery backend", async () => {
    mockDiscoveryAdapter.onGet("/api/v1/datasets/100").reply(200, {
      id: "100",
      title: "Dataset 100",
      description: "This is dataset 100",
      distributions: [
        {
          description: "Distribution description",
          title: "Distribution title",
          id: "distribution-1",
          accessService: [
            {
              description: null,
              id: null,
              title: "",
              endpoint_url: [],
            },
          ],
        },
      ],
    });

    const response = await retrieveDatasetApi("100");

    expect(response.distributions?.[0]?.accessService?.[0]).toMatchObject({
      description: null,
      id: null,
    });
  });

  test("accepts value-label compression and packaging formats", async () => {
    mockDiscoveryAdapter.onGet("/api/v1/datasets/101").reply(200, {
      id: "101",
      title: "Dataset 101",
      description: "This is dataset 101",
      distributions: [
        {
          description: "Distribution description",
          title: "Distribution title",
          id: "distribution-1",
          compressionFormat: {
            value: "gzip",
            label: "gzip",
          },
          packagingFormat: {
            value: "tar",
            label: "TAR archive",
          },
        },
      ],
    });

    const response = await retrieveDatasetApi("101");

    expect(response.distributions?.[0]?.compressionFormat).toEqual({
      value: "gzip",
      label: "gzip",
    });
    expect(response.distributions?.[0]?.packagingFormat).toEqual({
      value: "tar",
      label: "TAR archive",
    });
  });
});
