// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import serverConfig from "@/config/serverConfig";
import { encrypt } from "@/utils/encryption";
import { jest } from "@jest/globals";
import axios from "axios";
import { getServerSession } from "next-auth";
import { POST } from "../save-forms-and-duos/route";

jest.mock("axios");
jest.mock("next-auth/next");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Save forms and duos of an application", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns unauthorized if session is not available", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);
    const requestBody = {
      forms: [{ id: 1, fields: [{ fieldId: 1, value: "4,5,12" }] }],
      duoCodes: [],
    };
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request, { params: { id: "5" } });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  test("successfully save forms and duos to an application", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });
    const requestBody = {
      forms: [{ formId: 1, fields: [{ fieldId: 1, value: "4,5,12" }] }],
      duoCodes: [],
    };
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request, { params: { id: "5" } });

    expect(response.status).toBe(200);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${serverConfig.daamUrl}/api/v1/applications/5/save-forms-and-duos`,
      requestBody,
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
    mockedAxios.post.mockRejectedValue(new Error("something went wrong"));
    const requestBody = {
      forms: [{ id: 1, fields: [{ fieldId: 1, value: "4,5,12" }] }],
      duoCodes: [],
    };
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request, { params: { id: "9" } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      detail: "Unexpected error occurred, please contact the administrators.",
      status: 500,
      title: "Unexpected error occurred",
      validationWarnings: [],
    });
  });
});
