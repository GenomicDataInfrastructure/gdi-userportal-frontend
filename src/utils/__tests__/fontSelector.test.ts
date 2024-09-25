// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getSelectedFonts, fontVariables } from "../fontSelector";

jest.mock("@/config/theme", () => ({
  themeConfig: {
    fonts: {
      light: "satoshi",
      medium: "expose",
      sans: "tabular",
    },
  },
}));

jest.mock("@/config/fonts", () => ({
  fontMap: {
    expose: { variable: "--font-medium" },
    tabular: { variable: "--font-sans" },
    satoshi: { variable: "--font-light" },
  },
}));

describe("fontSelector", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("returns correct font variables when valid fonts are selected in themeConfig", () => {
    const result = getSelectedFonts();
    expect(result).toBe("--font-light --font-medium --font-sans");
  });

  it("returns empty string when no valid fonts are selected in themeConfig", async () => {
    jest.mock("@/config/theme", () => ({
      themeConfig: {
        fonts: {
          light: "invalidFont",
          medium: "anotherInvalidFont",
          sans: "invalidFontAgain",
        },
      },
    }));

    const { getSelectedFonts } = await import("../fontSelector");
    const result = getSelectedFonts();
    expect(result).toBe("");
  });

  it("returns partial font variables when some fonts are valid and others are invalid", async () => {
    jest.mock("@/config/theme", () => ({
      themeConfig: {
        fonts: {
          light: "satoshi",
          medium: "invalidFont",
          sans: "tabular",
        },
      },
    }));

    const { getSelectedFonts } = await import("../fontSelector");
    const result = getSelectedFonts();
    expect(result).toBe("--font-light --font-sans");
  });

  it("exports the correct value for fontVariables", () => {
    expect(fontVariables).toBe("--font-light --font-medium --font-sans");
  });
});
