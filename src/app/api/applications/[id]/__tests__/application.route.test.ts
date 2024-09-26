// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import serverConfig from "@/config/serverConfig";
import { encrypt } from "@/utils/encryption";
import axios from "axios";
import { getServerSession } from "next-auth";
import { GET } from "../route";

jest.mock("axios");
jest.mock("next-auth/next");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Retrieve an application", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns unauthorized if session is not available", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const request = new Request("http://localhost", { method: "GET" });
    const response = await GET(request, { params: { id: "1" } });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  test("successfully retrieves an application", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { applicationId: 9, description: "Test application" },
    });

    const request = new Request("http://localhost", { method: "GET" });
    const response = await GET(request, { params: { id: "9" } });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      applicationId: 9,
      description: "Test application",
    });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${serverConfig.daamUrl}/api/v1/applications/9`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer decryptedToken`,
        },
      }
    );
  });

  test("returns error if Axios request fails", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.get.mockRejectedValueOnce(new Error("server error"));

    const request = new Request("http://localhost", { method: "GET" });
    const response = await GET(request, { params: { id: "9" } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      detail: "Unexpected error occurred, please contact the administrators.",
      status: 500,
      title: "Unexpected error occurred",
      validationWarnings: [],
    });
  });
});
