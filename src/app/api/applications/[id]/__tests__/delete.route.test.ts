// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import serverConfig from "@/config/serverConfig";
import { encrypt } from "@/utils/encryption";
import axios from "axios";
import { getServerSession } from "next-auth";
import { DELETE } from "../route";

jest.mock("axios");
jest.mock("next-auth/next");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Delete an application", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("deletes an application", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.delete.mockResolvedValueOnce({
      status: 200,
    });

    const request = new Request("http://localhost", { method: "DELETE" });
    const response = await DELETE(request, { params: { id: "9" } });

    expect(response.status).toBe(200);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      `${serverConfig.daamUrl}/api/v1/applications/9`,
      {
        headers: {
          Authorization: `Bearer decryptedToken`,
        },
      }
    );
  });

  test("returns unauthorized if session is not available", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);
    const request = new Request("http://localhost", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params: { id: "5" } });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  test("returns error if Axios request fails", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.delete.mockRejectedValueOnce(new Error("server error"));

    const request = new Request("http://localhost", { method: "DELETE" });
    const response = await DELETE(request, { params: { id: "9" } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      detail: "Unexpected error occurred, please contact the administrators.",
      status: 500,
      title: "Unexpected error occurred",
      validationWarnings: [],
    });
  });
});
