// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import axios from "axios";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import serverConfig from "@/config/serverConfig";
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
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { count: 100 },
    });
  });

  test("returns RDF for authenticated user", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    const request = new Request("http://localhost", {
      method: "GET",
    });
    await GET(request, { params: { id: "1", format: "rdf" } });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${serverConfig.discoveryUrl}/api/v1/datasets/1.rdf`,
      {
        headers: {
          Authorization: "Bearer decryptedToken",
          "Content-Type": "application/json",
        },
        responseType: "text",
      }
    );
  });

  test("returns RDF for unauthenticated user", async () => {
    mockedGetServerSession.mockResolvedValueOnce(undefined);
    const request = new Request("http://localhost", {
      method: "GET",
    });
    await GET(request, { params: { id: "1", format: "rdf" } });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${serverConfig.discoveryUrl}/api/v1/datasets/1.rdf`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "text",
      }
    );
  });

  test("returns error if Axios request fails", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.get.mockRejectedValueOnce(new Error("Axios error"));

    const request = new Request("http://localhost", { method: "GET" });
    const response = await GET(request, { params: { id: "1", format: "rdf" } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      detail: "Unexpected error occurred, please contact the administrators.",
      status: 500,
      title: "Unexpected error occurred",
      validationWarnings: [],
    });
  });
});
