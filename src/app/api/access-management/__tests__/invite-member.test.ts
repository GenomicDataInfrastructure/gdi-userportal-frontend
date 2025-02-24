// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AxiosMockAdapter from "axios-mock-adapter";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import {
  accessManagementAxiosInstance,
  accessManagementClient,
} from "../../shared/client";
import { encrypt } from "@/utils/encryption";
import { inviteMemberApi } from "..";

jest.mock("next-auth/next");
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Inviting member to application", () => {
  const mockAccessManagementAdapter = new AxiosMockAdapter(
    accessManagementAxiosInstance
  );

  beforeEach(() => {
    jest.resetAllMocks();
    mockAccessManagementAdapter.reset();
  });

  test("Invites a member to an application successfully", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockAccessManagementAdapter
      .onPost("/api/v1/applications/67/invite-member")
      .reply(204);

    await expect(
      inviteMemberApi(67, {
        name: "John Doe",
        email: "john.doe@example.com",
      })
    ).resolves.toBeUndefined();
  });

  test("throws an error when AxiosError occurs for 404 Not Found", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockAccessManagementAdapter
      .onPost("/api/v1/applications/67/invite-member")
      .reply(404, {
        status: 404,
        detail: "The application with Id 67 was not found.",
      });

    await expect(
      inviteMemberApi(67, {
        name: "John Doe",
        email: "john.doe@example.com",
      })
    ).rejects.toThrow("The application with Id 67 was not found.");
  });

  test("throws an error when AxiosError occurs for 401 Unauthorized", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockAccessManagementAdapter
      .onPost("/api/v1/applications/67/invite-member")
      .reply(401, {
        status: 401,
        detail: "Unauthorized Access.",
      });

    await expect(
      inviteMemberApi(67, {
        name: "John Doe",
        email: "john.doe@example.com",
      })
    ).rejects.toThrow("Unauthorized Access.");
  });

  test("throws an error when AxiosError occurs for 500 Internal Server Error", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockAccessManagementAdapter
      .onPost("/api/v1/applications/67/invite-member")
      .reply(500, {
        status: 500,
        detail: "Internal server error.",
      });

    await expect(
      inviteMemberApi(67, {
        name: "John Doe",
        email: "john.doe@example.com",
      })
    ).rejects.toThrow("Internal server error.");
  });

  test("throws detailed error when error.cause is a ZodError", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["email"],
        message: "Invalid email format",
      },
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["name"],
        message: "Invalid name format",
      },
    ]);
    jest
      .spyOn(accessManagementClient, "invite_member_to_application_v1")
      .mockRejectedValueOnce({
        cause: zodError,
      });

    await expect(
      inviteMemberApi(67, {
        name: "John Doe",
        email: "john.doe@example.com",
      })
    ).rejects.toThrow(
      "Field email: Invalid email format \nField name: Invalid name format \n"
    );
  });
});
