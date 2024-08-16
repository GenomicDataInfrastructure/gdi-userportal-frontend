// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import axios from "axios";
import { makeOrganizationList } from "../organizationList";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const organizationList = makeOrganizationList(
  "https://mock-discovery-service.com"
);

describe("organizationList", () => {
  const mockApiResponse = {
    data: [
      {
        id: "id",
        name: "name",
        title: "title",
        description: "description",
        imageUrl: "imageUrl",
        numberOfDatasets: 1,
      },
    ],
  };
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.post.mockClear();
  });

  test("maps and asserts the full server response", async () => {
    const response = await organizationList();
    const data = response.data;
    expect(data).toHaveLength(1);
    const organization = data[0];

    expect(organization.id).toEqual("id");
    expect(organization.name).toEqual("name");
    expect(organization.title).toEqual("title");
    expect(organization.description).toEqual("description");
    expect(organization.imageUrl).toEqual("imageUrl");
    expect(organization.numberOfDatasets).toEqual(1);
  });
});
