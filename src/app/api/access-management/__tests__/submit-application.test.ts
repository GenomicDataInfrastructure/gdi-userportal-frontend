// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AxiosMockAdapter from "axios-mock-adapter";
import { accessManagementAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import { submitApplicationApi } from "@/app/api/access-management";

jest.mock("next-auth/next");
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Submitting an application", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(
    accessManagementAxiosInstance
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Submits an application", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/applications/44/submit").reply(200);

    await submitApplicationApi(44);
  });
});
