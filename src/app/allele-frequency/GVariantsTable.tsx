// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import {
  GVariantsSearchResponse,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";
import VariantAddToBasketButton from "./components/VariantAddToBasketButton";
import { findDatasetByIdentifier } from "@/utils/datasetEntitlements";
import React, { useEffect, useMemo, useState } from "react";

type GVariantsTableProps = {
  results: GVariantsSearchResponse[];
  datasetActions: Record<string, DatasetActionInfo>;
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

const getDisplayText = (value?: string) => value?.trim() || NOT_AVAILABLE;

const renderCell = (value: unknown) =>
  value != null && (typeof value === "string" || typeof value === "number") ? (
    value
  ) : (
    <span className="text-xs text-gray-400">not available</span>
  );

export default function GVariantsTable({
  results,
  datasetActions,
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
    <div className="overflow-x-auto">
      <table className="min-w-full border border-surface shadow-lg rounded-xl overflow-hidden table-fixed">
        <thead>
          <tr className="bg-primary text-surface">
            <th className="px-3 py-2 text-left">Dataset</th>
            <th className="px-3 py-2 text-left">Population</th>
            <th className="px-3 py-2 text-left">Allele Count</th>
            <th className="px-3 py-2 text-left">Allele Number</th>
            <th className="px-3 py-2 text-left">Homozygous</th>
            <th className="px-3 py-2 text-left">Heterozygous</th>
            <th className="px-3 py-2 text-left">Hemizygous</th>
            <th className="px-3 py-2 text-left">Frequency</th>
            <th className="px-3 py-2 text-left w-[220px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {beaconIds.map((beaconId) => {
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
                  <td colSpan={9} className="px-3 py-2 text-lg font-bold">
                    Beacon: {beaconId}
                  </td>
                </tr>
                {datasetIds.map((datasetId) => {
                  const groupKey = `${beaconId}::${datasetId}`;
                  const datasetGroup =
                    groupedByBeacon[beaconId].datasets[datasetId];
                  const isExpanded = expandedDatasets[groupKey];
                  const actionInfo = datasetActions[datasetId];
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
                        <td className="px-3 py-2">
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
                            className={`underline transition-colors ${
                              datasetId !== NOT_AVAILABLE
                                ? "text-primary hover:text-secondary hover:no-underline cursor-pointer"
                                : "text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                          >
                            {datasetId}
                          </button>
                        </td>
                        <td className="px-3 py-2" />
                        <td className="px-3 py-2">
                          {renderCell(totals?.alleleCount)}
                        </td>
                        <td className="px-3 py-2">
                          {renderCell(totals?.alleleNumber)}
                        </td>
                        <td className="px-3 py-2">
                          {renderCell(totals?.alleleCountHomozygous)}
                        </td>
                        <td className="px-3 py-2">
                          {renderCell(totals?.alleleCountHeterozygous)}
                        </td>
                        <td className="px-3 py-2">
                          {renderCell(totals?.alleleCountHemizygous)}
                        </td>
                        <td className="px-3 py-2">
                          {typeof totals?.alleleFrequency === "number"
                            ? totals.alleleFrequency.toFixed(4)
                            : renderCell(undefined)}
                        </td>
                        <td className="px-3 py-2 w-[220px]">
                          <div className="w-[220px]">
                            <VariantAddToBasketButton
                              datasetId={
                                datasetId === NOT_AVAILABLE ? "" : datasetId
                              }
                              dataset={actionInfo?.dataset ?? null}
                              isExternal={actionInfo?.isExternal ?? false}
                              externalAccessUrl={actionInfo?.externalAccessUrl}
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
                            <td className="px-3 py-2" />
                            <td className="px-3 py-2">
                              {variant.population || "-"}
                            </td>
                            <td className="px-3 py-2">
                              {renderCell(variant.alleleCount)}
                            </td>
                            <td className="px-3 py-2">
                              {renderCell(variant.alleleNumber)}
                            </td>
                            <td className="px-3 py-2">
                              {renderCell(variant.alleleCountHomozygous)}
                            </td>
                            <td className="px-3 py-2">
                              {renderCell(variant.alleleCountHeterozygous)}
                            </td>
                            <td className="px-3 py-2">
                              {renderCell(variant.alleleCountHemizygous)}
                            </td>
                            <td className="px-3 py-2">
                              {variant.alleleFrequency != null
                                ? variant.alleleFrequency.toFixed(4)
                                : renderCell(undefined)}
                            </td>
                            <td className="px-3 py-2 w-[220px]" />
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
  );
}
