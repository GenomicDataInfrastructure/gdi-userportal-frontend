// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { fetchGa4ghPassport } from "../passport";
import { extractVerifiedControlledAccessGrants } from "../visa";
import { retrieveEntitlementsV2 } from "../entitlements";

jest.mock("../passport");
jest.mock("../visa");

const mockedFetchGa4ghPassport = fetchGa4ghPassport as jest.MockedFunction<
  typeof fetchGa4ghPassport
>;
const mockedExtractVerified =
  extractVerifiedControlledAccessGrants as jest.MockedFunction<
    typeof extractVerifiedControlledAccessGrants
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
  },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

/** A resolved ControlledAccessGrant returned by the mocked extractor. */
const GRANT = {
  datasetId: "GDID-12345678-11se",
  iat: CONTROLLED_ACCESS_VISA.iat,
  exp: CONTROLLED_ACCESS_VISA.exp,
  source: CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.source,
  by: CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.by,
};

describe("retrieveEntitlementsV2", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns empty entitlements when passport contains no visas", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({ visaJwts: [], passportPresent: true });
    mockedExtractVerified.mockResolvedValueOnce([]);

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [], passportPresent: true });
  });

  it("passes raw passport JWTs to extractVerifiedControlledAccessGrants", async () => {
    const rawJwt = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    mockedFetchGa4ghPassport.mockResolvedValueOnce({ visaJwts: [rawJwt], passportPresent: true });
    mockedExtractVerified.mockResolvedValueOnce([GRANT]);

    await retrieveEntitlementsV2();

    expect(mockedExtractVerified).toHaveBeenCalledWith([rawJwt]);
  });

  it("maps a single ControlledAccessGrants visa to a dataset entitlement", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({
      visaJwts: [makeVisaJwt(CONTROLLED_ACCESS_VISA)],
      passportPresent: true,
    });
    mockedExtractVerified.mockResolvedValueOnce([GRANT]);

    const result = await retrieveEntitlementsV2();

    expect(result.entitlements).toHaveLength(1);
    expect(result.entitlements[0].datasetId).toBe("GDID-12345678-11se");
  });

  it("converts iat Unix timestamp to ISO 8601 start date", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({
      visaJwts: [makeVisaJwt(CONTROLLED_ACCESS_VISA)],
      passportPresent: true,
    });
    mockedExtractVerified.mockResolvedValueOnce([GRANT]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements[0].start).toBe(
      new Date(CONTROLLED_ACCESS_VISA.iat * 1000).toISOString()
    );
  });

  it("omits start date when visa iat is absent", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({ visaJwts: [], passportPresent: true });
    mockedExtractVerified.mockResolvedValueOnce([{ ...GRANT, iat: undefined }]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements[0].start).toBeUndefined();
  });

  it("converts exp Unix timestamp to ISO 8601 end date", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({
      visaJwts: [makeVisaJwt(CONTROLLED_ACCESS_VISA)],
      passportPresent: true,
    });
    mockedExtractVerified.mockResolvedValueOnce([GRANT]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements[0].end).toBe(
      new Date(CONTROLLED_ACCESS_VISA.exp * 1000).toISOString()
    );
  });

  it("ignores non-ControlledAccessGrants visas (extractor returns empty)", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({
      visaJwts: [makeVisaJwt(RESEARCHER_STATUS_VISA)],
      passportPresent: true,
    });
    mockedExtractVerified.mockResolvedValueOnce([]);

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [], passportPresent: true });
  });

  it("maps multiple ControlledAccessGrants visas to multiple entitlements", async () => {
    const secondGrant = {
      ...GRANT,
      datasetId: "GDID-99999999-xyz",
      exp: 1900000000,
    };

    mockedFetchGa4ghPassport.mockResolvedValueOnce({
      visaJwts: [makeVisaJwt(CONTROLLED_ACCESS_VISA)],
      passportPresent: true,
    });
    mockedExtractVerified.mockResolvedValueOnce([GRANT, secondGrant]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements).toHaveLength(2);
    expect(entitlements.map((e) => e.datasetId)).toEqual([
      "GDID-12345678-11se",
      "GDID-99999999-xyz",
    ]);
  });

  it("omits end date when visa exp is absent", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({ visaJwts: [], passportPresent: true });
    mockedExtractVerified.mockResolvedValueOnce([{ ...GRANT, exp: undefined }]);

    const { entitlements } = await retrieveEntitlementsV2();

    expect(entitlements[0].end).toBeUndefined();
  });

  it("sets passportPresent: false when ga4gh_passport_v1 claim is absent", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({ visaJwts: [], passportPresent: false });
    mockedExtractVerified.mockResolvedValueOnce([]);

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [], passportPresent: false });
  });

  it("preserves passportPresent: true when grant extraction throws", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({ visaJwts: ["some-jwt"], passportPresent: true });
    mockedExtractVerified.mockRejectedValueOnce(new Error("JWKS fetch failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [], passportPresent: true });
    consoleSpy.mockRestore();
  });

  it("returns empty entitlements when passport fetch fails", async () => {
    mockedFetchGa4ghPassport.mockRejectedValueOnce(
      new Error("LS-AAI token exchange failed: 401")
    );
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [], passportPresent: false });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[entitlements] Passport fetch failed; returning empty entitlements",
      expect.objectContaining({ error: "LS-AAI token exchange failed: 401" })
    );
    consoleSpy.mockRestore();
  });

  it("returns empty entitlements when passport fetch times out", async () => {
    mockedFetchGa4ghPassport.mockRejectedValueOnce(
      new Error("LS-AAI broker endpoint timed out")
    );
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [], passportPresent: false });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[entitlements] Passport fetch failed; returning empty entitlements",
      expect.objectContaining({ error: "LS-AAI broker endpoint timed out" })
    );
    consoleSpy.mockRestore();
  });

  it("returns empty entitlements when visa grant extraction throws", async () => {
    mockedFetchGa4ghPassport.mockResolvedValueOnce({ visaJwts: ["some-jwt"], passportPresent: true });
    mockedExtractVerified.mockRejectedValueOnce(new Error("JWKS fetch failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await retrieveEntitlementsV2();

    expect(result).toEqual({ entitlements: [], passportPresent: true });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[entitlements] Visa grant extraction failed; returning empty entitlements",
      expect.objectContaining({ error: "JWKS fetch failed" })
    );
    consoleSpy.mockRestore();
  });
});
