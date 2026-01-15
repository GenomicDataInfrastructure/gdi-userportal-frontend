// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
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
        datasetId: "EGAD50000000276",
        population: "FR_M",
        sex: "M",
        countryOfBirth: "FR",
        alleleCount: 7102.0,
        alleleNumber: 54233.0,
        alleleCountHomozygous: 2400.0,
        alleleCountHeterozygous: 4702.0,
        alleleCountHemizygous: 0.0,
        alleleFrequency: 0.13095,
      },
    ]);
    const response = await searchGVariantsApi({
      params: {
        referenceName: "15",
        start: [101055235],
        end: null,
        referenceBases: "G",
        alternateBases: "A",
        assemblyId: "GRCh38",
      },
    });

    expect(response).toBeDefined();
    expect(response.length).toEqual(1);
    expect(response[0]).toMatchObject({
      beacon: "org.nbis.ga4gh-approval-beacon-test",
      datasetId: "EGAD50000000276",
      population: "FR_M",
      sex: "M",
      countryOfBirth: "FR",
      alleleCountHemizygous: 0.0,
      alleleFrequency: 0.13095,
    });
  });
});
