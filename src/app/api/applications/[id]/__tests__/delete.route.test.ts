// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import serverConfig from "@/config/serverConfig";
import { encrypt } from "@/utils/encryption";
import axios from "axios";
import { getServerSession } from "next-auth";
import { POST } from "../delete/route";

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
    const response = await POST(request, { params: { id: "9" } });

    expect(response.status).toBe(200);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${serverConfig.daamUrl}/api/v1/applications/9/delete`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer decryptedToken`,
        },
      }
    );
  });
});
