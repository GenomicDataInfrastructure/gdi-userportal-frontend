// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import serverConfig from "@/config/serverConfig";
import { encrypt } from "@/utils/encryption";
import { jest } from "@jest/globals";
import axios from "axios";
import { getServerSession } from "next-auth";
import { GET } from "../route";

jest.mock("axios");
jest.mock("next-auth/next");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("GET function", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns facets response for authenticated user", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          facetGroup: "ckan",
          key: "publisher_name",
          label: "Publishers",
          values: [{ label: "publisherName", value: "adeling" }],
        },
      ],
    });

    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    const response = await GET();
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson.length).toEqual(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${serverConfig.discoveryUrl}/api/v1/filters`,
      {
        headers: {
          Authorization: "Bearer decryptedToken",
          "Content-Type": "application/json",
        },
      }
    );
  });

  test("returns facets response for unauthenticated user", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          facetGroup: "ckan",
          key: "publisher_name",
          label: "Publishers",
          values: [{ label: "publisherName", value: "adeling" }],
        },
      ],
    });
    mockedGetServerSession.mockResolvedValueOnce(undefined);
    const response = await GET();
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson.length).toEqual(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${serverConfig.discoveryUrl}/api/v1/filters`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  });

  test("returns error if Axios request fails", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.get.mockRejectedValueOnce(new Error("Axios error"));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      detail: "Unexpected error occurred, please contact the administrators.",
      status: 500,
      title: "Unexpected error occurred",
      validationWarnings: [],
    });
  });
});
