// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import formatHealthCategoryLabel from "../healthCategoryLabels";

describe("formatHealthCategoryLabel", () => {
  it("returns the full label for a known health category code", () => {
    expect(formatHealthCategoryLabel("EHRS")).toEqual(
      "Electronic Health Data from EHRs"
    );
  });

  it("is case insensitive", () => {
    expect(formatHealthCategoryLabel("ehrs")).toEqual(
      "Electronic Health Data from EHRs"
    );
  });

  it("returns undefined for an unknown code", () => {
    expect(formatHealthCategoryLabel("UNKNOWN")).toBeUndefined();
  });
});
