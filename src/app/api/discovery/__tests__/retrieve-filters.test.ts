// SPDX-FileCopyrightText: 2024 PNED G.I.E.
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

  test("Retrieves filters", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onGet("/api/v1/filters").reply(200, [
      {
        source: "CKAN",
        key: "organization",
        title: "Organization",
        type: "DROPDOWN",
      },
    ]);
    const response = await retrieveFiltersApi();

    expect(response).toBeDefined();
    expect(response.length).toEqual(1);
  });
});
