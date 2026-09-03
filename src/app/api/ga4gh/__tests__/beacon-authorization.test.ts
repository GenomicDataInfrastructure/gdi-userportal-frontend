// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import {
  assertBeaconAuthorization,
  checkBeaconAuthorization,
  validateBeaconVisaStatuses,
  __resetBeaconAuthorizationCache,
} from "../beacon-authorization";
import { BeaconAuthorizationError } from "../beacon-authorization.types";
import { Ga4ghVisaPayload } from "../visa";

jest.mock("@/app/api/auth/auth", () => ({
  getToken: jest.fn(),
}));

jest.mock("../passport", () => ({
  fetchGa4ghVisas: jest.fn(),
}));

jest.mock("../visa", () => {
  const actual = jest.requireActual("../visa") as object;
  return {
    ...actual,
    extractVerifiedVisas: jest.fn(),
  };
});

import { getToken } from "@/app/api/auth/auth";
import { extractVerifiedVisas } from "../visa";
import { fetchGa4ghVisas } from "../passport";

const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;
const mockedFetchGa4ghVisas = fetchGa4ghVisas as jest.MockedFunction<
  typeof fetchGa4ghVisas
>;
const mockedExtractVerifiedVisas = extractVerifiedVisas as jest.MockedFunction<
  typeof extractVerifiedVisas
>;

function makeVisaJwt(payload: object): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.fakesignature`;
}

const researcherStatusVisa: Ga4ghVisaPayload = {
  iss: "https://issuer.example.org",
  sub: "user@lifescience-ri.eu",
  iat: 1785223779,
  exp: 9999999999,
  ga4gh_visa_v1: {
    type: "ResearcherStatus",
    value: "https://doi.org/10.1038/s41431-018-0219-y",
    source: "https://issuer.example.org",
    by: "so",
    iat: 1785223779,
    exp: 9999999999,
  },
};

const acceptedTermsVisa: Ga4ghVisaPayload = {
  iss: "https://issuer.example.org",
  sub: "user@lifescience-ri.eu",
  iat: 1785223779,
  exp: 9999999999,
  ga4gh_visa_v1: {
    type: "AcceptedTermsAndPolicies",
    value: "https://doi.org/10.1038/s41431-018-0219-y",
    source: "https://issuer.example.org",
    by: "self",
    iat: 1785223779,
    exp: 9999999999,
  },
};

describe("validateBeaconVisaStatuses", () => {
  test("returns true for both when valid ResearcherStatus and AcceptedTermsAndPolicies visas are present", () => {
    const result = validateBeaconVisaStatuses([
      researcherStatusVisa,
      acceptedTermsVisa,
    ]);
    expect(result).toEqual({
      hasResearcherStatus: true,
      hasAcceptedTC: true,
    });
  });

  test("returns false for ResearcherStatus when by is not 'so'", () => {
    const invalid = {
      ...researcherStatusVisa,
      ga4gh_visa_v1: { ...researcherStatusVisa.ga4gh_visa_v1, by: "peer" },
    };
    const result = validateBeaconVisaStatuses([invalid, acceptedTermsVisa]);
    expect(result).toEqual({
      hasResearcherStatus: false,
      hasAcceptedTC: true,
    });
  });

  test("returns false for AcceptedTermsAndPolicies when by is not 'self'", () => {
    const invalid = {
      ...acceptedTermsVisa,
      ga4gh_visa_v1: { ...acceptedTermsVisa.ga4gh_visa_v1, by: "so" },
    };
    const result = validateBeaconVisaStatuses([researcherStatusVisa, invalid]);
    expect(result).toEqual({
      hasResearcherStatus: true,
      hasAcceptedTC: false,
    });
  });

  // TODO(ART-28730): re-enable expiry check once visa exp dates are persistent.
  test("does not check expiry while ART-28730 is pending", () => {
    const expired = {
      ...researcherStatusVisa,
      ga4gh_visa_v1: { ...researcherStatusVisa.ga4gh_visa_v1, exp: 1 },
    };
    const result = validateBeaconVisaStatuses([expired, acceptedTermsVisa]);
    expect(result).toEqual({
      hasResearcherStatus: true,
      hasAcceptedTC: true,
    });
  });

  // TODO(ART-28730): re-enable value check once RESEARCHER_STATUS_URI is configured.
  test("does not check value URI while ART-28730 is pending", () => {
    const invalid = {
      ...researcherStatusVisa,
      ga4gh_visa_v1: {
        ...researcherStatusVisa.ga4gh_visa_v1,
        value: "https://example.org/other",
      },
    };
    const result = validateBeaconVisaStatuses([invalid, acceptedTermsVisa]);
    expect(result).toEqual({
      hasResearcherStatus: true,
      hasAcceptedTC: true,
    });
  });
});

describe("checkBeaconAuthorization", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    __resetBeaconAuthorizationCache();
    delete process.env.RESEARCHER_STATUS_URI;
    delete process.env.LEGAL_DOC_URL;
  });

  test("returns false for both when user is unauthenticated", async () => {
    mockedGetToken.mockResolvedValueOnce(null);
    mockedFetchGa4ghVisas.mockResolvedValueOnce({
      visaJwts: [],
      passportPresent: false,
    });

    const result = await checkBeaconAuthorization();

    expect(result).toEqual({
      hasResearcherStatus: false,
      hasAcceptedTC: false,
    });
    expect(mockedFetchGa4ghVisas).toHaveBeenCalledWith(null);
  });

  test("extracts visas from access token ga4gh_visas claim when present", async () => {
    const accessToken = makeVisaJwt({
      sub: "user",
      ga4gh_visas: [makeVisaJwt(researcherStatusVisa)],
    });
    mockedGetToken.mockResolvedValueOnce(accessToken);
    mockedFetchGa4ghVisas.mockResolvedValueOnce({
      visaJwts: [makeVisaJwt(researcherStatusVisa)],
      passportPresent: true,
    });
    mockedExtractVerifiedVisas.mockResolvedValueOnce([
      { jwt: "jwt", payload: researcherStatusVisa },
    ]);

    const result = await checkBeaconAuthorization();

    expect(result).toEqual({
      hasResearcherStatus: true,
      hasAcceptedTC: false,
    });
    expect(mockedFetchGa4ghVisas).toHaveBeenCalledWith(accessToken);
  });

  test("falls back to LS-AAI passport when ga4gh_visas is absent", async () => {
    mockedGetToken.mockResolvedValueOnce("access-token");
    mockedFetchGa4ghVisas.mockResolvedValueOnce({
      visaJwts: [
        makeVisaJwt(researcherStatusVisa),
        makeVisaJwt(acceptedTermsVisa),
      ],
      passportPresent: true,
    });
    mockedExtractVerifiedVisas.mockResolvedValueOnce([
      { jwt: "jwt1", payload: researcherStatusVisa },
      { jwt: "jwt2", payload: acceptedTermsVisa },
    ]);

    const result = await checkBeaconAuthorization();

    expect(result).toEqual({
      hasResearcherStatus: true,
      hasAcceptedTC: true,
    });
  });

  test("returns false when passport is absent", async () => {
    mockedGetToken.mockResolvedValueOnce("access-token");
    mockedFetchGa4ghVisas.mockResolvedValueOnce({
      visaJwts: [],
      passportPresent: false,
    });

    const result = await checkBeaconAuthorization();

    expect(result).toEqual({
      hasResearcherStatus: false,
      hasAcceptedTC: false,
    });
    expect(mockedExtractVerifiedVisas).not.toHaveBeenCalled();
  });
});

describe("assertBeaconAuthorization", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    __resetBeaconAuthorizationCache();
    delete process.env.RESEARCHER_STATUS_URI;
    delete process.env.LEGAL_DOC_URL;
  });

  test("does not throw when both visas are valid", async () => {
    mockedGetToken.mockResolvedValueOnce("access-token");
    mockedFetchGa4ghVisas.mockResolvedValueOnce({
      visaJwts: [
        makeVisaJwt(researcherStatusVisa),
        makeVisaJwt(acceptedTermsVisa),
      ],
      passportPresent: true,
    });
    mockedExtractVerifiedVisas.mockResolvedValueOnce([
      { jwt: "jwt1", payload: researcherStatusVisa },
      { jwt: "jwt2", payload: acceptedTermsVisa },
    ]);

    await expect(assertBeaconAuthorization()).resolves.toBeUndefined();
  });

  test("throws BeaconAuthorizationError when ResearcherStatus is missing", async () => {
    mockedGetToken.mockResolvedValueOnce("access-token");
    mockedFetchGa4ghVisas.mockResolvedValueOnce({
      visaJwts: [makeVisaJwt(acceptedTermsVisa)],
      passportPresent: true,
    });
    mockedExtractVerifiedVisas.mockResolvedValueOnce([
      { jwt: "jwt2", payload: acceptedTermsVisa },
    ]);

    await expect(assertBeaconAuthorization()).rejects.toBeInstanceOf(
      BeaconAuthorizationError
    );
  });

  test("throws BeaconAuthorizationError when T&C is missing", async () => {
    mockedGetToken.mockResolvedValueOnce("access-token");
    mockedFetchGa4ghVisas.mockResolvedValueOnce({
      visaJwts: [makeVisaJwt(researcherStatusVisa)],
      passportPresent: true,
    });
    mockedExtractVerifiedVisas.mockResolvedValueOnce([
      { jwt: "jwt1", payload: researcherStatusVisa },
    ]);

    await expect(assertBeaconAuthorization()).rejects.toBeInstanceOf(
      BeaconAuthorizationError
    );
  });
});
