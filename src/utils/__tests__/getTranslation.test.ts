// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getTranslation } from "../getTranslation";

describe("getTranslation", () => {
  it("should return the correct translation for a known key", () => {
    expect(getTranslation("required")).toBe("This field is required");
  });

  it("should return the key itself if the key is not in LABELS", () => {
    const unknownKey = "t.unknown.key";
    expect(getTranslation(unknownKey)).toBe(unknownKey);
  });

  it("should return undefined if no key is provided", () => {
    expect(getTranslation(undefined)).toBeUndefined();
  });

  it("should return undefined if key is an empty string", () => {
    expect(getTranslation("")).toBe("");
  });
});
