// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import axios from "axios";
import { listApplications } from "../listApplications";
import { ListedApplication } from "@/types/application.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("listApplications", () => {
  const mockApiResponse = {
    data: [
      {
        id: 1,
        title: "Test application 1",
        stateChangedAt: "",
        currentState: "Submited",
      },
      {
        id: 2,
        title: "Test application 2",
        stateChangedAt: "",
        currentState: "Approved",
      },
    ] as ListedApplication[],
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test("sends a GET request and retrives applications of signed in user", async () => {
    const response = await listApplications();

    expect(response.data).toBe(mockApiResponse.data);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/applications", {
      headers: { "Content-Type": "application/json" },
    });
  });
});
