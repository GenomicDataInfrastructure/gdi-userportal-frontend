// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getInitials } from "../avatarInitials";

describe("getInitials", () => {
  it("should return null if name is not provided", () => {
    expect(getInitials()).toBe(null);
  });

  it("should return initials of the name", () => {
    expect(getInitials("John")).toBe("J");
    expect(getInitials("john")).toBe("J");

    expect(getInitials("John Doe")).toBe("JD");
    expect(getInitials("John doe")).toBe("JD");
    expect(getInitials("john doe")).toBe("JD");

    expect(getInitials("John Doe Smith")).toBe("JDS");
    expect(getInitials("John doe Smith")).toBe("JDS");
    expect(getInitials("john doe smith")).toBe("JDS");

    expect(getInitials("John Doe Smith Junior")).toBe("JDSJ");
    expect(getInitials("John doe Smith Junior")).toBe("JSJ");
    expect(getInitials("John doe smith Junior")).toBe("JJ");
    expect(getInitials("John doe smith junior")).toBe("J");
    expect(getInitials("john doe smith junior")).toBe("JDSJ");
  });
});
