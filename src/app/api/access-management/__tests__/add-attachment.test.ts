// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AxiosMockAdapter from "axios-mock-adapter";
import { accessManagementAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import { addAttachmentToApplicationApi } from "@/app/api/access-management";

jest.mock("next-auth/next");
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Adding an attachment to an application", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(
    accessManagementAxiosInstance
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Adds an attachment to an application", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter
      .onPost("/api/v1/applications/67/attachments")
      .reply(200, {
        id: "122",
      });

    const formData = new FormData();
    formData.append(
      "file",
      new Blob(["file content"], { type: "text/plain" }),
      "file.txt"
    );

    const response = await addAttachmentToApplicationApi(67, formData);

    expect(response).toBeDefined();
    expect(response).toEqual("122");
  });
});
