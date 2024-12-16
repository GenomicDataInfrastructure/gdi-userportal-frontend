// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AxiosMockAdapter from "axios-mock-adapter";
import { accessManagementAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import { deleteApplicationApi } from "@/app/api/access-management";

jest.mock("next-auth/next");
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Deleting an application", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(
    accessManagementAxiosInstance
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Delete an application of the authenticated user", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onDelete("/api/v1/applications/54").reply(200);

    await deleteApplicationApi(54);
  });
});
