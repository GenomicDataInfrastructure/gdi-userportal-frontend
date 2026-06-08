// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { COUNTRY_OPTIONS } from "@/app/api/discovery/additional-types";
import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";

export type DatasetGroup = {
  totalVariant?: GVariantsSearchResponse;
  variants: GVariantsSearchResponse[];
};

export type BeaconGroup = {
  datasets: Record<string, DatasetGroup>;
};

export type GVariantSummaryData = {
  population: string;
  alleleCount: number | null;
  alleleNumber: number | null;
  frequency: number | null;
};

export class GVariantsTableUtils {
  static readonly NOT_AVAILABLE = "not available";

  private static readonly COUNTRY_BY_CODE = new Map<string, string>(
    COUNTRY_OPTIONS.map((country) => [country.value, country.label])
  );

  static getDisplayText(value?: string): string {
    return value?.trim() || GVariantsTableUtils.NOT_AVAILABLE;
  }

  static getBeaconCountryLabel(beaconId: string): string | undefined {
    const parts = beaconId
      .toUpperCase()
      .split(/[^A-Z0-9]+/)
      .filter(Boolean);
    const matchedCode = parts.find((part) =>
      GVariantsTableUtils.COUNTRY_BY_CODE.has(part)
    );
    return matchedCode
      ? GVariantsTableUtils.COUNTRY_BY_CODE.get(matchedCode)
      : undefined;
  }

  static sortResults(
    results: GVariantsSearchResponse[]
  ): GVariantsSearchResponse[] {
    return [...results].sort((a, b) => {
      const beaconComparison = GVariantsTableUtils.getDisplayText(
        a.beacon
      ).localeCompare(GVariantsTableUtils.getDisplayText(b.beacon), undefined, {
        sensitivity: "base",
        numeric: true,
      });
      if (beaconComparison !== 0) {
        return beaconComparison;
      }

      const datasetComparison = GVariantsTableUtils.getDisplayText(
        a.datasetId
      ).localeCompare(
        GVariantsTableUtils.getDisplayText(b.datasetId),
        undefined,
        {
          sensitivity: "base",
          numeric: true,
        }
      );
      if (datasetComparison !== 0) {
        return datasetComparison;
      }

      return GVariantsTableUtils.getDisplayText(a.population).localeCompare(
        GVariantsTableUtils.getDisplayText(b.population),
        undefined,
        {
          sensitivity: "base",
          numeric: true,
        }
      );
    });
  }

  static groupByBeacon(
    sortedResults: GVariantsSearchResponse[]
  ): Record<string, BeaconGroup> {
    return sortedResults.reduce(
      (acc, variant) => {
        const datasetId = GVariantsTableUtils.getDisplayText(variant.datasetId);
        const beaconId = GVariantsTableUtils.getDisplayText(variant.beacon);

        if (!acc[beaconId]) {
          acc[beaconId] = {
            datasets: {},
          };
        }

        if (!acc[beaconId].datasets[datasetId]) {
          acc[beaconId].datasets[datasetId] = {
            variants: [],
          };
        }

        const population = GVariantsTableUtils.getDisplayText(
          variant.population
        ).toLowerCase();
        if (population === "total") {
          acc[beaconId].datasets[datasetId].totalVariant ??= variant;
          return acc;
        }

        acc[beaconId].datasets[datasetId].variants.push(variant);
        return acc;
      },
      {} as Record<string, BeaconGroup>
    );
  }

  static getSortedBeaconIds(groupedByBeacon: Record<string, BeaconGroup>) {
    return Object.keys(groupedByBeacon).sort((a, b) =>
      a.localeCompare(b, undefined, {
        sensitivity: "base",
        numeric: true,
      })
    );
  }

  static getRowsForSummary(
    sortedResults: GVariantsSearchResponse[]
  ): GVariantsSearchResponse[] {
    return sortedResults.filter(
      (variant) =>
        GVariantsTableUtils.getDisplayText(variant.population).toLowerCase() !==
        "total"
    );
  }

  static buildSummaryData(
    rowsForSummary: GVariantsSearchResponse[]
  ): GVariantSummaryData | null {
    if (rowsForSummary.length === 0) {
      return null;
    }

    const populations = Array.from(
      new Set(
        rowsForSummary
          .map((variant) => variant.population?.trim())
          .filter((population): population is string => !!population)
      )
    ).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base", numeric: true })
    );

    let alleleCount = 0;
    let alleleNumber = 0;
    let hasAlleleCount = false;
    let hasAlleleNumber = false;

    rowsForSummary.forEach((variant) => {
      if (GVariantsTableUtils.isNumber(variant.alleleCount)) {
        alleleCount += variant.alleleCount;
        hasAlleleCount = true;
      }
      if (GVariantsTableUtils.isNumber(variant.alleleNumber)) {
        alleleNumber += variant.alleleNumber;
        hasAlleleNumber = true;
      }
    });

    return {
      population: GVariantsTableUtils.formatPopulationSummary(populations),
      alleleCount: hasAlleleCount ? alleleCount : null,
      alleleNumber: hasAlleleNumber ? alleleNumber : null,
      frequency:
        hasAlleleCount && hasAlleleNumber && alleleNumber > 0
          ? alleleCount / alleleNumber
          : null,
    };
  }

  private static isNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
  }

  private static formatPopulationSummary(populations: string[]): string {
    if (populations.length === 0) {
      return GVariantsTableUtils.NOT_AVAILABLE;
    }
    if (populations.length === 1) {
      return populations[0];
    }

    const preview = populations.slice(0, 2).join(", ");
    const remaining = populations.length - 2;
    return remaining > 0 ? `${preview}, +${remaining} more` : preview;
  }
}
