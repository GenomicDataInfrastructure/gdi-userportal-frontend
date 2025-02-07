// SPDX-FileCopyrightText: 2024 PNED G.I.E.
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
});
