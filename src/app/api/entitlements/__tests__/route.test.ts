// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { jest } from "@jest/globals";
import axios from "axios";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import serverConfig from "@/config/serverConfig";
import { GET } from "../route";
import { Entitlement } from "@/types/entitlements.types";

jest.mock("axios");
jest.mock("next-auth/next");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const encryptedToken = encrypt("decryptedToken");

describe("GET function", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns unauthorized if session is not available", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  test("returns error if Axios request fails", async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.get.mockRejectedValueOnce(new Error("Server error"));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Server error" });
  });

  test("successfully gets entitlements", async () => {
    const mockApiResponse = {
      data: [
        {
          datasetId: "identifier 1",
          start: "12-01-2024",
          end: "12-12-2024",
        },
        {
          datasetId: "identifier 1",
          start: "12-01-2024",
          end: "12-12-2024",
        },
      ] as Entitlement[],
    };

    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const response = await GET();
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson.length).toEqual(2);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${serverConfig.daamUrl}/api/v1/entitlements`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer decryptedToken`,
        },
      }
    );
  });
});
