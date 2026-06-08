// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import {
  GVariantsSearchResponse,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";
import { COUNTRY_OPTIONS } from "@/app/api/discovery/additional-types";
import VariantAddToBasketButton from "./components/VariantAddToBasketButton";
import { findDatasetByIdentifier } from "@/utils/datasetEntitlements";
import React, { useEffect, useMemo, useState } from "react";

type GVariantsTableProps = {
  results: GVariantsSearchResponse[];
  datasetActions: Record<string, DatasetActionInfo>;
  showSummary?: boolean;
};

type DatasetGroup = {
  totalVariant?: GVariantsSearchResponse;
  variants: GVariantsSearchResponse[];
};

type BeaconGroup = {
  datasets: Record<string, DatasetGroup>;
};

type DatasetActionInfo = {
  dataset: SearchedDataset | null;
  isExternal: boolean;
  externalAccessUrl?: string;
};

const NOT_AVAILABLE = "not available";
const COUNTRY_BY_CODE = new Map<string, string>(
  COUNTRY_OPTIONS.map((c) => [c.value, c.label])
);

const getDisplayText = (value?: string) => value?.trim() || NOT_AVAILABLE;
const getBeaconCountryLabel = (beaconId: string) => {
  const parts = beaconId
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);
  const matchedCode = parts.find((part) => COUNTRY_BY_CODE.has(part));
  return matchedCode ? COUNTRY_BY_CODE.get(matchedCode) : undefined;
};

const renderCell = (value: unknown) =>
  value != null && (typeof value === "string" || typeof value === "number") ? (
    value
  ) : (
    <span className="text-xs text-gray-400">not available</span>
  );

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const formatPopulationSummary = (populations: string[]) => {
  if (populations.length === 0) {
    return NOT_AVAILABLE;
  }
  if (populations.length === 1) {
    return populations[0];
  }

  const preview = populations.slice(0, 2).join(", ");
  const remaining = populations.length - 2;
  return remaining > 0 ? `${preview}, +${remaining} more` : preview;
};

export default function GVariantsTable({
  results,
  datasetActions,
  showSummary = false,
}: GVariantsTableProps) {
  const [expandedDatasets, setExpandedDatasets] = useState<
    Record<string, boolean>
  >({});

  const sortedResults = useMemo(
    () =>
      [...results].sort((a, b) => {
        const beaconComparison = getDisplayText(a.beacon).localeCompare(
          getDisplayText(b.beacon),
          undefined,
          {
            sensitivity: "base",
            numeric: true,
          }
        );
        if (beaconComparison !== 0) {
          return beaconComparison;
        }

        const datasetComparison = getDisplayText(a.datasetId).localeCompare(
          getDisplayText(b.datasetId),
          undefined,
          {
            sensitivity: "base",
            numeric: true,
          }
        );
        if (datasetComparison !== 0) {
          return datasetComparison;
        }

        return getDisplayText(a.population).localeCompare(
          getDisplayText(b.population),
          undefined,
          {
            sensitivity: "base",
            numeric: true,
          }
        );
      }),
    [results]
  );

  const groupedByBeacon = useMemo(
    () =>
      sortedResults.reduce(
        (acc, variant) => {
          const datasetId = getDisplayText(variant.datasetId);
          const beaconId = getDisplayText(variant.beacon);

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

          const population = getDisplayText(variant.population).toLowerCase();
          if (population === "total") {
            // Prefer server-provided totals row over client-side aggregation.
            acc[beaconId].datasets[datasetId].totalVariant ??= variant;
            return acc;
          }

          acc[beaconId].datasets[datasetId].variants.push(variant);
          return acc;
        },
        {} as Record<string, BeaconGroup>
      ),
    [sortedResults]
  );

  const beaconIds = useMemo(
    () =>
      Object.keys(groupedByBeacon).sort((a, b) =>
        a.localeCompare(b, undefined, {
          sensitivity: "base",
          numeric: true,
        })
      ),
    [groupedByBeacon]
  );

  const datasetTypeByDatasetId = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(datasetActions).map(([datasetId, actionInfo]) => [
          datasetId,
          getDisplayText(actionInfo?.dataset?.datasetType),
        ])
      ),
    [datasetActions]
  );

  const rowsForSummary = useMemo(() => {
    const nonTotalRows = sortedResults.filter(
      (variant) => getDisplayText(variant.population).toLowerCase() !== "total"
    );
    return nonTotalRows.length > 0 ? nonTotalRows : sortedResults;
  }, [sortedResults]);

  const summaryData = useMemo(() => {
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
      if (isNumber(variant.alleleCount)) {
        alleleCount += variant.alleleCount;
        hasAlleleCount = true;
      }
      if (isNumber(variant.alleleNumber)) {
        alleleNumber += variant.alleleNumber;
        hasAlleleNumber = true;
      }
    });

    return {
      population: formatPopulationSummary(populations),
      alleleCount: hasAlleleCount ? alleleCount : null,
      alleleNumber: hasAlleleNumber ? alleleNumber : null,
      frequency:
        hasAlleleCount && hasAlleleNumber && alleleNumber > 0
          ? alleleCount / alleleNumber
          : null,
    };
  }, [rowsForSummary]);

  const datasetGroupKeys = useMemo(
    () =>
      beaconIds.flatMap((beaconId) =>
        Object.keys(groupedByBeacon[beaconId].datasets).map(
          (datasetId) => `${beaconId}::${datasetId}`
        )
      ),
    [beaconIds, groupedByBeacon]
  );

  useEffect(() => {
    setExpandedDatasets(
      datasetGroupKeys.reduce(
        (acc, groupKey) => {
          acc[groupKey] = false;
          return acc;
        },
        {} as Record<string, boolean>
      )
    );
  }, [datasetGroupKeys]);

  const openDatasetInNewWindow = (datasetId: string) => {
    window.open(`/datasets/${datasetId}`, "_blank", "noopener,noreferrer");
  };

  const handleDatasetClick = async (identifier: string) => {
    const cachedDatasetId = datasetActions[identifier]?.dataset?.id;
    if (cachedDatasetId) {
      openDatasetInNewWindow(cachedDatasetId);
      return;
    }

    const dataset = await findDatasetByIdentifier(identifier);
    if (dataset?.id) {
      openDatasetInNewWindow(dataset.id);
    } else {
      console.warn(`Dataset not found for identifier: ${identifier}`);
    }
  };

  const toggleDatasetExpansion = (groupKey: string) => {
    setExpandedDatasets((previousState) => ({
      ...previousState,
      [groupKey]: !previousState[groupKey],
    }));
  };

  return (
    <div className="space-y-6">
      {showSummary && summaryData && beaconIds.length > 1 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Summary for current filter
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] lg:min-w-full border border-surface shadow-lg rounded-xl overflow-hidden table-fixed text-xs sm:text-sm">
              <thead>
                <tr className="bg-primary text-surface">
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    Scope
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    Population
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    Allele Count
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    Allele Number
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    Frequency
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-surface border border-secondary">
                  <td className="px-3 py-2 whitespace-nowrap">
                    All visible matching datasets
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {summaryData.population}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {summaryData.alleleCount != null
                      ? summaryData.alleleCount.toLocaleString()
                      : renderCell(undefined)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {summaryData.alleleNumber != null
                      ? summaryData.alleleNumber.toLocaleString()
                      : renderCell(undefined)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {summaryData.frequency != null
                      ? summaryData.frequency.toFixed(4)
                      : renderCell(undefined)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          Detailed results
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] lg:min-w-full border border-surface shadow-lg rounded-xl overflow-hidden table-fixed text-xs sm:text-sm">
            <thead>
              <tr className="bg-primary text-surface">
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Dataset
                </th>
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Dataset Type
                </th>
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Population
                </th>
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Allele Count
                </th>
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Allele Number
                </th>
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Homozygous
                </th>
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Heterozygous
                </th>
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Hemizygous
                </th>
                <th className="px-3 py-2 text-left whitespace-nowrap">
                  Frequency
                </th>
                <th className="px-3 py-2 text-left w-[220px] whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {beaconIds.map((beaconId) => {
                const beaconCountryLabel = getBeaconCountryLabel(beaconId);
                const datasetIds = Object.keys(
                  groupedByBeacon[beaconId].datasets
                ).sort((a, b) =>
                  a.localeCompare(b, undefined, {
                    sensitivity: "base",
                    numeric: true,
                  })
                );

                return (
                  <React.Fragment key={beaconId}>
                    <tr className="bg-[#70154C14] border border-secondary">
                      <td
                        colSpan={10}
                        className="px-3 py-2 text-base sm:text-lg font-bold"
                      >
                        Beacon: {beaconId}
                        {beaconCountryLabel ? ` (${beaconCountryLabel})` : ""}
                      </td>
                    </tr>
                    {datasetIds.map((datasetId) => {
                      const groupKey = `${beaconId}::${datasetId}`;
                      const datasetGroup =
                        groupedByBeacon[beaconId].datasets[datasetId];
                      const isExpanded = expandedDatasets[groupKey];
                      const actionInfo = datasetActions[datasetId];
                      const datasetType =
                        datasetTypeByDatasetId[datasetId] ?? NOT_AVAILABLE;
                      const totals =
                        datasetGroup.totalVariant ??
                        (datasetGroup.variants.length === 1
                          ? datasetGroup.variants[0]
                          : undefined);
                      const rowsToRender =
                        datasetGroup.variants.length > 0
                          ? datasetGroup.variants
                          : datasetGroup.totalVariant
                            ? [datasetGroup.totalVariant]
                            : [];

                      return (
                        <React.Fragment key={groupKey}>
                          <tr className="bg-surface border border-secondary">
                            <td className="px-3 py-2 whitespace-nowrap">
                              <button
                                onClick={() => toggleDatasetExpansion(groupKey)}
                                className="mr-2 font-semibold"
                                aria-label={`Toggle dataset group ${datasetId}`}
                              >
                                {isExpanded ? "▼" : "▶"}
                              </button>
                              <button
                                onClick={() => handleDatasetClick(datasetId)}
                                disabled={datasetId === NOT_AVAILABLE}
                                className={`underline transition-colors break-all ${
                                  datasetId !== NOT_AVAILABLE
                                    ? "text-primary hover:text-secondary hover:no-underline cursor-pointer"
                                    : "text-gray-400 cursor-not-allowed opacity-50"
                                }`}
                              >
                                {datasetId}
                              </button>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {datasetType}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap" />
                            <td className="px-3 py-2 whitespace-nowrap">
                              {renderCell(totals?.alleleCount)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {renderCell(totals?.alleleNumber)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {renderCell(totals?.alleleCountHomozygous)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {renderCell(totals?.alleleCountHeterozygous)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {renderCell(totals?.alleleCountHemizygous)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {typeof totals?.alleleFrequency === "number"
                                ? totals.alleleFrequency.toFixed(4)
                                : renderCell(undefined)}
                            </td>
                            <td className="px-3 py-2 w-[220px] whitespace-nowrap">
                              <div className="w-[220px]">
                                <VariantAddToBasketButton
                                  datasetId={
                                    datasetId === NOT_AVAILABLE ? "" : datasetId
                                  }
                                  dataset={actionInfo?.dataset ?? null}
                                  isExternal={actionInfo?.isExternal ?? false}
                                  externalAccessUrl={
                                    actionInfo?.externalAccessUrl
                                  }
                                  disabled={
                                    datasetId === NOT_AVAILABLE ||
                                    (datasetId !== NOT_AVAILABLE && !actionInfo)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                          {isExpanded &&
                            rowsToRender.map((variant, index) => (
                              <tr
                                key={`${groupKey}-${index}`}
                                className="border-t border-surface bg-[#70154C14]"
                              >
                                <td className="px-3 py-2 whitespace-nowrap" />
                                <td className="px-3 py-2 whitespace-nowrap" />
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {variant.population || "-"}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {renderCell(variant.alleleCount)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {renderCell(variant.alleleNumber)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {renderCell(variant.alleleCountHomozygous)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {renderCell(variant.alleleCountHeterozygous)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {renderCell(variant.alleleCountHemizygous)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {variant.alleleFrequency != null
                                    ? variant.alleleFrequency.toFixed(4)
                                    : renderCell(undefined)}
                                </td>
                                <td className="px-3 py-2 w-[220px] whitespace-nowrap" />
                              </tr>
                            ))}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
