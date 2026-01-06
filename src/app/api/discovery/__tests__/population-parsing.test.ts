// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import {
  parseGoEPopulation,
  formatPopulationDisplay,
} from "@/app/api/discovery/additional-types";

describe("parseGoEPopulation", () => {
  it("parses all formats", () => {
    expect(parseGoEPopulation("M")).toEqual({ country: null, sex: "M" });
    expect(parseGoEPopulation("FR_M")).toEqual({ country: "FR", sex: "M" });
    expect(parseGoEPopulation("FR")).toEqual({ country: "FR", sex: null });
    expect(parseGoEPopulation("XX_M")).toEqual({ country: null, sex: null });
  });
});

describe("formatPopulationDisplay", () => {
  it("formats all types", () => {
    expect(formatPopulationDisplay("FR_M")).toBe("FRANCE (Male)");
    expect(formatPopulationDisplay("M")).toBe("Male");
    expect(formatPopulationDisplay("FR")).toBe("FRANCE");
    expect(formatPopulationDisplay("fra")).toBe("FRANCE");
    expect(formatPopulationDisplay("unknown")).toBe("UNKNOWN");
  });
});
