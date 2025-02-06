// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getInitials } from "../avatar";

describe("getInitials", () => {
  it("should return null if name is not provided", () => {
    expect(getInitials()).toBe(null);
  });

  it("should return initials of the name", () => {
    expect(getInitials("John Doe")).toBe("JD");
    expect(getInitials("John doe")).toBe("J");
    expect(getInitials("John")).toBe("J");
    expect(getInitials("John Doe Smith")).toBe("JDS");
    expect(getInitials("John doe Smith")).toBe("JS");
    expect(getInitials("john doe smith")).toBe("JDS");
  });
});
