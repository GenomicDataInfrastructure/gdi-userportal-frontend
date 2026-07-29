// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { fetchGa4ghPassport } from "../passport";
import { retrieveEntitlementsV2 } from "../entitlements";

jest.mock("../passport");
const mockedFetchGa4ghPassport = fetchGa4ghPassport as jest.MockedFunction<
  typeof fetchGa4ghPassport
>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeVisaJwt(payload: object): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.fakesignature`;
}

const CONTROLLED_ACCESS_VISA = {
  iss: "https://daam.portal.dev.gdi.lu/",
  sub: "2951f8b568bd3595d9a291605e88207fac707718@lifescience-ri.eu",
  iat: 1785223779,
  exp: 1816759779,
  ga4gh_visa_v1: {
    type: "ControlledAccessGrants",
    value: "GDID-12345678-11se",
    source: "https://daam.portal.dev.gdi.lu/",
    by: "dac",
    asserted: 1784905094,
  },
};

const RESEARCHER_STATUS_VISA = {
  iss: "https://other-issuer.example.org/",
  sub: "2951f8b568bd3595d9a291605e88207fac707718@lifescience-ri.eu",
  iat: 1785223779,
  exp: 1816759779,
  ga4gh_visa_v1: {
    type: "ResearcherStatus",
    value: "https://doi.org/10.1038/s41431-018-0219-y",
    source: "https://other-issuer.example.org/",
    by: "peer",
    asserted: 1784905094,
  },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("retrieveEntitlementsV2", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns empty entitlements when passport contains no visas", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce([]);

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [] });
  });

  it("maps a single ControlledAccessGrants visa to a dataset entitlement", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce([
      makeVisaJwt(CONTROLLED_ACCESS_VISA),
    ]);

    const result = await retrieveEntitlementsV2();

    expect(result.entitlements).toHaveLength(1);
    expect(result.entitlements[0].datasetId).toBe("GDID-12345678-11se");
  });

  it("converts asserted Unix timestamp to ISO 8601 start date", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce([
      makeVisaJwt(CONTROLLED_ACCESS_VISA),
    ]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements[0].start).toBe(
      new Date(
        CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.asserted * 1000
      ).toISOString()
    );
  });

  it("converts exp Unix timestamp to ISO 8601 end date", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce([
      makeVisaJwt(CONTROLLED_ACCESS_VISA),
    ]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements[0].end).toBe(
      new Date(CONTROLLED_ACCESS_VISA.exp * 1000).toISOString()
    );
  });

  it("ignores non-ControlledAccessGrants visas", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce([
      makeVisaJwt(RESEARCHER_STATUS_VISA),
    ]);

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [] });
  });

  it("extracts only ControlledAccessGrants from a mixed passport", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce([
      makeVisaJwt(CONTROLLED_ACCESS_VISA),
      makeVisaJwt(RESEARCHER_STATUS_VISA),
    ]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements).toHaveLength(1);
    expect(entitlements[0].datasetId).toBe("GDID-12345678-11se");
  });

  it("maps multiple ControlledAccessGrants visas to multiple entitlements", async () => {
    const second = {
      ...CONTROLLED_ACCESS_VISA,
      exp: 1900000000,
      ga4gh_visa_v1: {
        ...CONTROLLED_ACCESS_VISA.ga4gh_visa_v1,
        value: "GDID-99999999-xyz",
        asserted: 1785000000,
      },
    };

    mockedFetchGa4ghPassport.mockResolvedValueOnce([
      makeVisaJwt(CONTROLLED_ACCESS_VISA),
      makeVisaJwt(second),
    ]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements).toHaveLength(2);
    expect(entitlements.map((e) => e.datasetId)).toEqual([
      "GDID-12345678-11se",
      "GDID-99999999-xyz",
    ]);
  });

  it("propagates errors thrown by fetchGa4ghPassport", async () => {
    mockedFetchGa4ghPassport.mockRejectedValueOnce(
      new Error("LS-AAI token exchange failed: 401")
    );

    await expect(retrieveEntitlementsV2()).rejects.toThrow(
      "LS-AAI token exchange failed: 401"
    );
  });
});
