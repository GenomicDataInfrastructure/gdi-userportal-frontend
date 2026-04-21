// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { retrieveFiltersApi } from "@/app/api/discovery";
import AxiosMockAdapter from "axios-mock-adapter";
import { discoveryAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";

jest.mock("next-auth/next");

const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Retrieving filters", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(discoveryAxiosInstance);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Retrieves filters and remaps DDS keys for app consumers", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onGet("/api/v1/filters").reply(200, [
      {
        source: "CKAN",
        key: "publisher_name",
        title: "Organization",
        type: "DROPDOWN",
      },
      {
        source: "CKAN",
        key: "modified",
        title: "Modified",
        type: "DATETIME",
      },
    ]);
    const response = await retrieveFiltersApi();

    expect(response).toBeDefined();
    expect(response.length).toEqual(2);
    expect(response[0].key).toBe("publisherName");
    expect(response[1].key).toBe("modified");
  });
});
