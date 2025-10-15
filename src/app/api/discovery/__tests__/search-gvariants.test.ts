// SPDX-FileCopyrightText: 2024 Center for Genomic Regulation
// SPDX-FileContributor: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { searchGVariantsApi } from "@/app/api/discovery";
import AxiosMockAdapter from "axios-mock-adapter";
import { discoveryAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import { GVariantSearchQuery } from "@/app/api/discovery/open-api/schemas";

jest.mock("next-auth/next");

const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Search GVariants", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(discoveryAxiosInstance);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Search GVariants with valid", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/g_variants").reply(200, [
      {
        beacon: "org.nbis.ga4gh-approval-beacon-test",
        dataset: "COVID_pop11_fin_1",
        population: "fin",
        alleleCount: 357,
        alleleNumber: 82998,
        alleleCountHomozygous: 0,
        alleleCountHeterozygous: 357,
        alleleFrequency: 0.004301310051232576,
      },
    ]);
    const response = await searchGVariantsApi({
      params: {},
    } as GVariantSearchQuery);

    expect(response).toBeDefined();
    expect(response.length).toEqual(1);
  });
});
