// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  decodeVisaPayload,
  extractControlledAccessGrants,
  Ga4ghVisaPayload,
} from "../visa";

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

const CONTROLLED_ACCESS_VISA: Ga4ghVisaPayload = {
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

const RESEARCHER_STATUS_VISA: Ga4ghVisaPayload = {
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
// decodeVisaPayload
// ---------------------------------------------------------------------------

describe("decodeVisaPayload", () => {
  test("decodes a valid ControlledAccessGrants visa JWT", () => {
    const jwt = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    const result = decodeVisaPayload(jwt);

    expect(result).not.toBeNull();
    expect(result!.iss).toBe("https://daam.portal.dev.gdi.lu/");
    expect(result!.exp).toBe(1816759779);
    expect(result!.ga4gh_visa_v1.type).toBe("ControlledAccessGrants");
    expect(result!.ga4gh_visa_v1.value).toBe("GDID-12345678-11se");
  });

  test("decodes a valid ResearcherStatus visa JWT", () => {
    const jwt = makeVisaJwt(RESEARCHER_STATUS_VISA);
    const result = decodeVisaPayload(jwt);

    expect(result).not.toBeNull();
    expect(result!.ga4gh_visa_v1.type).toBe("ResearcherStatus");
  });

  test("returns null for a malformed JWT", () => {
    expect(decodeVisaPayload("not.a.jwt")).toBeNull();
    expect(decodeVisaPayload("")).toBeNull();
    expect(decodeVisaPayload("only-one-segment")).toBeNull();
  });

  test("returns null when ga4gh_visa_v1 claim is absent", () => {
    const jwt = makeVisaJwt({ iss: "https://example.org", sub: "user", iat: 0, exp: 0 });
    expect(decodeVisaPayload(jwt)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// extractControlledAccessGrants
// ---------------------------------------------------------------------------

describe("extractControlledAccessGrants", () => {
  test("extracts ControlledAccessGrants and ignores other visa types", () => {
    const jwtA = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    const jwtB = makeVisaJwt(RESEARCHER_STATUS_VISA);

    const grants = extractControlledAccessGrants([jwtA, jwtB]);

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");
  });

  test("maps grant fields correctly from the visa payload", () => {
    const jwt = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    const [grant] = extractControlledAccessGrants([jwt]);

    expect(grant.datasetId).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.value);
    expect(grant.source).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.source);
    expect(grant.by).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.by);
    expect(grant.asserted).toBe(CONTROLLED_ACCESS_VISA.ga4gh_visa_v1.asserted);
    expect(grant.exp).toBe(CONTROLLED_ACCESS_VISA.exp);
  });

  test("returns empty array when passport contains no ControlledAccessGrants", () => {
    const jwt = makeVisaJwt(RESEARCHER_STATUS_VISA);
    expect(extractControlledAccessGrants([jwt])).toEqual([]);
  });

  test("returns empty array for an empty passport", () => {
    expect(extractControlledAccessGrants([])).toEqual([]);
  });

  test("skips malformed JWTs without throwing", () => {
    const validJwt = makeVisaJwt(CONTROLLED_ACCESS_VISA);
    const grants = extractControlledAccessGrants(["bad-token", validJwt]);

    expect(grants).toHaveLength(1);
    expect(grants[0].datasetId).toBe("GDID-12345678-11se");
  });

  test("extracts multiple ControlledAccessGrants from a single passport", () => {
    const second: Ga4ghVisaPayload = {
      ...CONTROLLED_ACCESS_VISA,
      ga4gh_visa_v1: {
        ...CONTROLLED_ACCESS_VISA.ga4gh_visa_v1,
        value: "GDID-99999999-abc",
      },
    };

    const grants = extractControlledAccessGrants([
      makeVisaJwt(CONTROLLED_ACCESS_VISA),
      makeVisaJwt(RESEARCHER_STATUS_VISA),
      makeVisaJwt(second),
    ]);

    expect(grants).toHaveLength(2);
    expect(grants.map((g) => g.datasetId)).toEqual([
      "GDID-12345678-11se",
      "GDID-99999999-abc",
    ]);
  });
});
