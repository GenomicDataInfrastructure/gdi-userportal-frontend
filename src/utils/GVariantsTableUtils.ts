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

export type VariantGroup = {
  key: string;
  label: string;
  rows: GVariantsSearchResponse[];
  groupedByBeacon: Record<string, BeaconGroup>;
  beaconIds: string[];
};

export class GVariantsTableUtils {
  static readonly NOT_AVAILABLE = "not available";
  static readonly DEFAULT_VARIANT_LABEL = "Matched variant";

  private static readonly COUNTRY_BY_CODE = new Map<string, string>(
    COUNTRY_OPTIONS.map((country) => [country.value, country.label])
  );

  static getDisplayText(value?: string): string {
    return value?.trim() || GVariantsTableUtils.NOT_AVAILABLE;
  }

  static isTotalPopulation(population?: string): boolean {
    const p = population?.trim().toLowerCase();
    return p === "total" || p === "m" || p === "f";
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
    // First pass: assign literal "total" rows to totalVariant; everything else to variants.
    const result = sortedResults.reduce(
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

        const population = variant.population?.trim();
        if (population?.toLowerCase() === "total") {
          acc[beaconId].datasets[datasetId].totalVariant ??= variant;
          return acc;
        }

        acc[beaconId].datasets[datasetId].variants.push(variant);
        return acc;
      },
      {} as Record<string, BeaconGroup>
    );

    // Second pass: for groups that have no literal "total", promote the first
    // country-code row (e.g. "FR") or sex-aggregate row ("m"/"f") to totalVariant.
    // This avoids double-counting when a global "total" is also present.
    for (const beaconGroup of Object.values(result)) {
      for (const datasetGroup of Object.values(beaconGroup.datasets)) {
        if (datasetGroup.totalVariant) continue;
        const idx = datasetGroup.variants.findIndex((v) => {
          const p = v.population?.trim();
          const pu = p?.toUpperCase();
          return (
            p === "m" ||
            p === "f" ||
            p === "M" ||
            p === "F" ||
            (!!pu && GVariantsTableUtils.COUNTRY_BY_CODE.has(pu))
          );
        });
        if (idx !== -1) {
          datasetGroup.totalVariant = datasetGroup.variants[idx];
          datasetGroup.variants.splice(idx, 1);
        }
      }
    }

    return result;
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
      (variant) => !GVariantsTableUtils.isTotalPopulation(variant.population)
    );
  }

  static getEffectiveTotals(
    groupedByBeacon: Record<string, BeaconGroup>
  ): GVariantsSearchResponse[] {
    return Object.values(groupedByBeacon).flatMap((beaconGroup) =>
      Object.values(beaconGroup.datasets)
        .map(
          (datasetGroup) =>
            datasetGroup.totalVariant ??
            GVariantsTableUtils.aggregateVariants(datasetGroup.variants)
        )
        .filter((v): v is GVariantsSearchResponse => v !== undefined)
    );
  }

  static buildVariantLabel(variant: GVariantsSearchResponse): string {
    const referenceName = variant.referenceName?.trim();
    if (!referenceName || !GVariantsTableUtils.isNumber(variant.start)) {
      return GVariantsTableUtils.DEFAULT_VARIANT_LABEL;
    }
    const oneBasedStart = variant.start + 1;

    const referenceBases = variant.referenceBases?.trim();
    const alternateBases = variant.alternateBases?.trim();
    if (referenceBases && alternateBases) {
      return `${referenceName}-${oneBasedStart}-${referenceBases}-${alternateBases}`;
    }

    if (GVariantsTableUtils.isNumber(variant.end)) {
      const oneBasedEnd = variant.end;
      if (oneBasedEnd > oneBasedStart) {
        return `${referenceName}-${oneBasedStart}-${oneBasedEnd}`;
      }
    }

    return `${referenceName}-${oneBasedStart}`;
  }

  static groupResultsByVariant(
    sortedResults: GVariantsSearchResponse[]
  ): VariantGroup[] {
    const groupedRows = sortedResults.reduce((acc, row) => {
      const label = GVariantsTableUtils.buildVariantLabel(row);
      const group = acc.get(label) ?? [];
      group.push(row);
      acc.set(label, group);
      return acc;
    }, new Map<string, GVariantsSearchResponse[]>());

    return Array.from(groupedRows.entries())
      .sort(([labelA], [labelB]) =>
        labelA.localeCompare(labelB, undefined, {
          sensitivity: "base",
          numeric: true,
        })
      )
      .map(([label, rows]) => {
        const groupedByBeacon = GVariantsTableUtils.groupByBeacon(rows);
        return {
          key: label,
          label,
          rows,
          groupedByBeacon,
          beaconIds: GVariantsTableUtils.getSortedBeaconIds(groupedByBeacon),
        };
      });
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

  static aggregateVariants(
    variants: GVariantsSearchResponse[]
  ): GVariantsSearchResponse | undefined {
    if (variants.length === 0) return undefined;
    if (variants.length === 1) return variants[0];

    let alleleCount = 0;
    let alleleNumber = 0;
    let hasAlleleCount = false;
    let hasAlleleNumber = false;

    for (const v of variants) {
      if (GVariantsTableUtils.isNumber(v.alleleCount)) {
        alleleCount += v.alleleCount;
        hasAlleleCount = true;
      }
      if (GVariantsTableUtils.isNumber(v.alleleNumber)) {
        alleleNumber += v.alleleNumber;
        hasAlleleNumber = true;
      }
    }

    return {
      ...variants[0],
      population: "total",
      alleleCount: hasAlleleCount ? alleleCount : undefined,
      alleleNumber: hasAlleleNumber ? alleleNumber : undefined,
      alleleFrequency:
        hasAlleleCount && hasAlleleNumber && alleleNumber > 0
          ? alleleCount / alleleNumber
          : undefined,
      alleleCountHomozygous: undefined,
      alleleCountHeterozygous: undefined,
      alleleCountHemizygous: undefined,
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
