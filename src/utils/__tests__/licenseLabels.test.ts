// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import formatLicenseLabel from "../licenseLabels";

describe("formatLicenseLabel", () => {
  it("returns the full name for a known license URI", () => {
    expect(
      formatLicenseLabel(
        "http://creativecommons.org/publicdomain/zero/1.0/legalcode"
      )
    ).toEqual("Creative Commons Zero v1.0 Universal");
  });

  it("matches the canonical /legalcode form and the bare form the same way", () => {
    expect(
      formatLicenseLabel(
        "https://creativecommons.org/publicdomain/zero/1.0/legalcode"
      )
    ).toEqual(
      formatLicenseLabel("http://creativecommons.org/publicdomain/zero/1.0/")
    );
  });

  it("matches regardless of http/https scheme or www prefix", () => {
    expect(
      formatLicenseLabel("https://opendatacommons.org/licenses/odbl/1.0/")
    ).toEqual("Open Database License v1.0");
    expect(
      formatLicenseLabel("http://www.opendatacommons.org/licenses/odbl/1.0/")
    ).toEqual("Open Database License v1.0");
  });

  it("returns undefined for an unknown license URI", () => {
    expect(
      formatLicenseLabel("https://example.org/licenses/unknown")
    ).toBeUndefined();
  });
});
