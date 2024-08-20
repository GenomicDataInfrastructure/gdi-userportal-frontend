// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import axios from "axios";
import { makePublisherList } from "../publisherList";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const publisherList = makePublisherList("https://mock-discovery-service.com");

describe("publisherList", () => {
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
    const response = await publisherList();
    const data = response.data;
    expect(data).toHaveLength(1);
    const publisher = data[0];

    expect(publisher.id).toEqual("id");
    expect(publisher.name).toEqual("name");
    expect(publisher.title).toEqual("title");
    expect(publisher.description).toEqual("description");
    expect(publisher.imageUrl).toEqual("imageUrl");
    expect(publisher.numberOfDatasets).toEqual(1);
  });
});
