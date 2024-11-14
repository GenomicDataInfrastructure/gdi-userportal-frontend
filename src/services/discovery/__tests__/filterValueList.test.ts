// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import { filterValuesList } from "../public/filterValueList";
import { FilterValueType } from "../types/dataset.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("filterValuesList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return filter values when API call is successful", async () => {
    // Arrange
    const mockResponse = {
      data: [
        { value: "value1", label: "Label 1" },
        { value: "value2", label: "Label 2" },
      ],
      status: 200,
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    // Act
    const filterKey: FilterValueType = FilterValueType.PUBLISHER;
    const result = await filterValuesList(filterKey);

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledWith(`/api/filters/${filterKey}`);
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error when API call fails", async () => {
    // Arrange
    const mockError = new Error("API Error");
    mockedAxios.get.mockRejectedValueOnce(mockError);

    // Act & Assert
    const filterKey: FilterValueType = FilterValueType.PUBLISHER;
    await expect(filterValuesList(filterKey)).rejects.toThrow("API Error");
  });
});
