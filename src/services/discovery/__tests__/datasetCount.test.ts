// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-FileContributor: Stichting Health-RI
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from "@jest/globals";
import { makeDatasetCount } from "../public/datasetCount";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("makeDatasetCount", () => {
  const mockApiResponse = { data: { count: 100 } };

  beforeEach(() => {
    mockedAxios.post.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test("fetches and returns the correct dataset count from the API", async () => {
    const discoveryUrl = "http://localhost:5500";
    const getDatasetCount = makeDatasetCount(discoveryUrl);

    const count = await getDatasetCount();

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(count).toEqual(100);
  });
});
