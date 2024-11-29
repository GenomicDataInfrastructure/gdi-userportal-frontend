// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import axios from "axios";
import { makeFilterValuesList } from "../filterValueList";
import { FilterValueType } from "../types/dataset.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const publisherList = makeFilterValuesList(
  "https://mock-discovery-service.com"
);

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
    const response = await publisherList(FilterValueType.PUBLISHER);
    const data = response.data;
    expect(data).toHaveLength(1);
    const publisher = data[0];
    expect(publisher.label).toEqual(undefined);
    expect(publisher.value).toEqual(undefined);
  });
});
