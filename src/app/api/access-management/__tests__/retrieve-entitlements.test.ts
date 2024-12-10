// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AxiosMockAdapter from "axios-mock-adapter";
import { accessManagementAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import { retrieveEntitlementsApi } from "@/app/api/access-management";

jest.mock("next-auth/next");
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Retrieving entitlements of an authenticated user", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(
    accessManagementAxiosInstance
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Retrieves a specific application of the authenticated user", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onGet("/api/v1/entitlements").reply(200, {
      entitlements: [
        {
          datasetId: "21",
          start: "2024-11-01",
        },
        {
          datasetId: "26",
          start: "2024-12-01",
        },
      ],
    });

    const response = await retrieveEntitlementsApi();

    expect(response).toBeDefined();
    expect(response.entitlements.length).toEqual(2);
  });
});
