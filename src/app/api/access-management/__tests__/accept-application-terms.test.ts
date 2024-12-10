// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AxiosMockAdapter from "axios-mock-adapter";
import { accessManagementAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import { acceptApplicationTermsApi } from "@/app/api/access-management";

jest.mock("next-auth/next");
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Accepting the terms of an application", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(
    accessManagementAxiosInstance
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Accepts the terms of an application", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter
      .onPost("/api/v1/applications/43/accept-terms")
      .reply(200);

    await acceptApplicationTermsApi(43, { acceptedLicenses: [21, 22] });
  });
});
