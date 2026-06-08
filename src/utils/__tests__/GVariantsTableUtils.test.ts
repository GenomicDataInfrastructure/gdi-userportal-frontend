// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";
import { GVariantsTableUtils } from "@/utils/GVariantsTableUtils";

const variant = (
  values: Partial<GVariantsSearchResponse>
): GVariantsSearchResponse => values as GVariantsSearchResponse;

describe("GVariantsTableUtils", () => {
  describe("getDisplayText", () => {
    test("returns not available for empty values", () => {
      expect(GVariantsTableUtils.getDisplayText(undefined)).toBe(
        "not available"
      );
      expect(GVariantsTableUtils.getDisplayText("   ")).toBe("not available");
    });

    test("returns trimmed text for non-empty values", () => {
      expect(GVariantsTableUtils.getDisplayText("  FI_F  ")).toBe("FI_F");
    });
  });

  describe("getBeaconCountryLabel", () => {
    test("extracts country label from beacon id tokens", () => {
      expect(GVariantsTableUtils.getBeaconCountryLabel("org.fi.beacon")).toBe(
        "Finland"
      );
      expect(GVariantsTableUtils.getBeaconCountryLabel("org_beacon_fr")).toBe(
        "France"
      );
    });

    test("returns undefined when country token is missing", () => {
      expect(
        GVariantsTableUtils.getBeaconCountryLabel("org.unknown.beacon")
      ).toBeUndefined();
    });
  });

  describe("sortResults", () => {
    test("sorts by beacon, then dataset, then population", () => {
      const sorted = GVariantsTableUtils.sortResults([
        variant({ beacon: "Beacon B", datasetId: "DS-2", population: "FI_F" }),
        variant({ beacon: "Beacon A", datasetId: "DS-10", population: "FI_F" }),
        variant({ beacon: "Beacon A", datasetId: "DS-2", population: "FI_M" }),
        variant({ beacon: "Beacon A", datasetId: "DS-2", population: "FI_F" }),
      ]);

      expect(
        sorted.map((it) => `${it.beacon}|${it.datasetId}|${it.population}`)
      ).toEqual([
        "Beacon A|DS-2|FI_F",
        "Beacon A|DS-2|FI_M",
        "Beacon A|DS-10|FI_F",
        "Beacon B|DS-2|FI_F",
      ]);
    });
  });

  describe("groupByBeacon", () => {
    test("groups rows by beacon and dataset, tracking total rows separately", () => {
      const grouped = GVariantsTableUtils.groupByBeacon([
        variant({
          beacon: "Beacon A",
          datasetId: "DS-1",
          population: "total",
          alleleCount: 10,
        }),
        variant({
          beacon: "Beacon A",
          datasetId: "DS-1",
          population: "total",
          alleleCount: 999,
        }),
        variant({ beacon: "Beacon A", datasetId: "DS-1", population: "FI_F" }),
        variant({ beacon: "Beacon A", datasetId: "DS-2", population: "FR_F" }),
        variant({ beacon: "Beacon B", datasetId: "DS-3", population: "total" }),
      ]);

      expect(Object.keys(grouped)).toEqual(["Beacon A", "Beacon B"]);
      expect(grouped["Beacon A"].datasets["DS-1"].variants).toHaveLength(1);
      expect(
        grouped["Beacon A"].datasets["DS-1"].totalVariant?.alleleCount
      ).toBe(10);
      expect(grouped["Beacon A"].datasets["DS-2"].variants).toHaveLength(1);
      expect(grouped["Beacon B"].datasets["DS-3"].variants).toHaveLength(0);
      expect(
        grouped["Beacon B"].datasets["DS-3"].totalVariant?.population
      ).toBe("total");
    });
  });

  describe("getSortedBeaconIds", () => {
    test("returns sorted beacon ids with numeric ordering", () => {
      const ids = GVariantsTableUtils.getSortedBeaconIds({
        "beacon-10": { datasets: {} },
        "beacon-2": { datasets: {} },
        "Beacon-1": { datasets: {} },
      });

      expect(ids).toEqual(["Beacon-1", "beacon-2", "beacon-10"]);
    });
  });

  describe("getRowsForSummary", () => {
    test("excludes total rows from summary rows", () => {
      const rows = GVariantsTableUtils.getRowsForSummary([
        variant({ population: "total" }),
        variant({ population: "FI_F" }),
      ]);

      expect(rows).toHaveLength(1);
      expect(rows[0].population).toBe("FI_F");
    });

    test("returns an empty list when only totals exist", () => {
      const rows = GVariantsTableUtils.getRowsForSummary([
        variant({ population: "total" }),
      ]);

      expect(rows).toEqual([]);
    });
  });

  describe("buildSummaryData", () => {
    test("returns null for empty summary rows", () => {
      expect(GVariantsTableUtils.buildSummaryData([])).toBeNull();
    });

    test("aggregates counts and computes weighted frequency", () => {
      const summary = GVariantsTableUtils.buildSummaryData([
        variant({ population: "FI_F", alleleCount: 100, alleleNumber: 1000 }),
        variant({ population: "FI_F", alleleCount: 50, alleleNumber: 500 }),
        variant({ population: "FI_M", alleleCount: 25, alleleNumber: 250 }),
      ]);

      expect(summary).toEqual({
        population: "FI_F, FI_M",
        alleleCount: 175,
        alleleNumber: 1750,
        frequency: 0.1,
      });
    });

    test("formats population summary when more than two populations exist", () => {
      const summary = GVariantsTableUtils.buildSummaryData([
        variant({ population: "FR_F", alleleCount: 1, alleleNumber: 10 }),
        variant({ population: "FI_F", alleleCount: 2, alleleNumber: 20 }),
        variant({ population: "ES_F", alleleCount: 3, alleleNumber: 30 }),
      ]);

      expect(summary?.population).toBe("ES_F, FI_F, +1 more");
    });

    test("keeps single population label unchanged", () => {
      const summary = GVariantsTableUtils.buildSummaryData([
        variant({ population: "FI_F", alleleCount: 2, alleleNumber: 20 }),
        variant({ population: "FI_F", alleleCount: 3, alleleNumber: 30 }),
      ]);

      expect(summary?.population).toBe("FI_F");
    });

    test("returns null numeric fields when counts are unavailable", () => {
      const summary = GVariantsTableUtils.buildSummaryData([
        variant({ population: undefined }),
      ]);

      expect(summary).toEqual({
        population: "not available",
        alleleCount: null,
        alleleNumber: null,
        frequency: null,
      });
    });
  });
});
