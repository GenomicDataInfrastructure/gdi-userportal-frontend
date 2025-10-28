// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { retrieveFilterValuesApi } from "@/app/api/discovery";
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

  test("Returns publisher filter values", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter
      .onGet("/api/v1/filters/publisher_name/values")
      .reply(200, [
        {
          value: "lnds",
          label: "LNDS",
          count: 12,
        },
        {
          value: "ega",
          label: "EGA",
          count: 9,
        },
      ]);
    const response = await retrieveFilterValuesApi("publisher_name");

    expect(response).toBeDefined();
    expect(response.length).toEqual(2);
  });
});
