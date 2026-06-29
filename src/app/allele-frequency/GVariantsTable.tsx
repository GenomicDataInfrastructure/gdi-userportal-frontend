// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import {
  GVariantsSearchResponse,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";
import VariantAddToBasketButton from "./components/VariantAddToBasketButton";
import { GVariantsTableUtils } from "@/utils/GVariantsTableUtils";
import { findDatasetByIdentifier } from "@/utils/datasetEntitlements";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type GVariantsTableProps = {
  results: GVariantsSearchResponse[];
  datasetActions: Record<string, DatasetActionInfo>;
  showSummary?: boolean;
};

type DatasetActionInfo = {
  dataset: SearchedDataset | null;
  isExternal: boolean;
  externalAccessUrl?: string;
};

const NOT_AVAILABLE = GVariantsTableUtils.NOT_AVAILABLE;

const renderCell = (value: unknown, notAvailableLabel: string) =>
  value != null && (typeof value === "string" || typeof value === "number") ? (
    value
  ) : (
    <span className="text-xs text-gray-400">{notAvailableLabel}</span>
  );

export default function GVariantsTable({
  results,
  datasetActions,
  showSummary = false,
}: GVariantsTableProps) {
  const t = useTranslations("alleleFrequency");
  const notAvailableLabel = t("notAvailable");
  const [expandedDatasets, setExpandedDatasets] = useState<
    Record<string, boolean>
  >({});

  const sortedResults = useMemo(
    () => GVariantsTableUtils.sortResults(results),
    [results]
  );

  const groupedByBeacon = useMemo(
    () => GVariantsTableUtils.groupByBeacon(sortedResults),
    [sortedResults]
  );

  const beaconIds = useMemo(
    () => GVariantsTableUtils.getSortedBeaconIds(groupedByBeacon),
    [groupedByBeacon]
  );

  const datasetTypeByDatasetId = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(datasetActions).map(([datasetId, actionInfo]) => [
          datasetId,
          GVariantsTableUtils.getDisplayText(actionInfo?.dataset?.datasetType),
        ])
      ),
    [datasetActions]
  );

  const rowsForSummary = useMemo(
    () => GVariantsTableUtils.getRowsForSummary(sortedResults),
    [sortedResults]
  );

  const summaryData = useMemo(
    () => GVariantsTableUtils.buildSummaryData(rowsForSummary),
    [rowsForSummary]
  );

  const variantGroups = useMemo(
    () => GVariantsTableUtils.groupResultsByVariant(sortedResults),
    [sortedResults]
  );

  const datasetGroupKeys = useMemo(
    () =>
      variantGroups.flatMap((variantGroup) =>
        variantGroup.beaconIds.flatMap((beaconId) =>
          Object.keys(variantGroup.groupedByBeacon[beaconId].datasets).map(
            (datasetId) => `${variantGroup.key}::${beaconId}::${datasetId}`
          )
        )
      ),
    [variantGroups]
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
            {t("summaryForCurrentFilter")}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] lg:min-w-full border border-surface shadow-lg rounded-xl overflow-hidden table-fixed text-xs sm:text-sm">
              <thead>
                <tr className="bg-primary text-surface">
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    {t("scope")}
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    {t("population")}
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    {t("alleleCount")}
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    {t("alleleNumber")}
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    {t("frequency")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-surface border border-secondary">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {t("allVisibleDatasets")}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {summaryData.population}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {summaryData.alleleCount != null
                      ? summaryData.alleleCount.toLocaleString()
                      : renderCell(undefined, notAvailableLabel)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {summaryData.alleleNumber != null
                      ? summaryData.alleleNumber.toLocaleString()
                      : renderCell(undefined, notAvailableLabel)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {summaryData.frequency != null
                      ? summaryData.frequency.toFixed(4)
                      : renderCell(undefined, notAvailableLabel)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          {t("detailedResults")}
        </h3>
        <div className="space-y-6">
          {variantGroups.map((variantGroup) => {
            const showVariantTitle =
              variantGroups.length > 1 ||
              variantGroup.label !== GVariantsTableUtils.DEFAULT_VARIANT_LABEL;

            return (
              <div key={variantGroup.key} className="space-y-2">
                {showVariantTitle && (
                  <p className="text-base sm:text-lg font-semibold">
                    {t("variantLabel")}
                    <span className="text-info break-all">
                      {variantGroup.label}
                    </span>
                  </p>
                )}
                <div className="overflow-x-auto">
                  <table className="min-w-[1100px] lg:min-w-full border border-surface shadow-lg rounded-xl overflow-hidden table-fixed text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-primary text-surface">
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("dataset")}
                        </th>
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("datasetType")}
                        </th>
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("population")}
                        </th>
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("alleleCount")}
                        </th>
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("alleleNumber")}
                        </th>
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("homozygous")}
                        </th>
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("heterozygous")}
                        </th>
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("hemizygous")}
                        </th>
                        <th className="px-3 py-2 text-left whitespace-nowrap">
                          {t("frequency")}
                        </th>
                        <th className="px-3 py-2 text-left w-[220px] whitespace-nowrap">
                          {t("actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantGroup.beaconIds.map((beaconId) => {
                        const beaconCountryLabel =
                          GVariantsTableUtils.getBeaconCountryLabel(beaconId);
                        const datasetIds = Object.keys(
                          variantGroup.groupedByBeacon[beaconId].datasets
                        ).sort((a, b) =>
                          a.localeCompare(b, undefined, {
                            sensitivity: "base",
                            numeric: true,
                          })
                        );

                        return (
                          <React.Fragment
                            key={`${variantGroup.key}::${beaconId}`}
                          >
                            <tr className="bg-[#70154C14] border border-secondary">
                              <td
                                colSpan={10}
                                className="px-3 py-2 text-base sm:text-lg font-bold"
                              >
                                {t("beacon")}
                                {beaconId}
                                {beaconCountryLabel
                                  ? ` (${beaconCountryLabel})`
                                  : ""}
                              </td>
                            </tr>
                            {datasetIds.map((datasetId) => {
                              const groupKey = `${variantGroup.key}::${beaconId}::${datasetId}`;
                              const datasetGroup =
                                variantGroup.groupedByBeacon[beaconId].datasets[
                                  datasetId
                                ];
                              const isExpanded = expandedDatasets[groupKey];
                              const actionInfo = datasetActions[datasetId];
                              const datasetType =
                                datasetTypeByDatasetId[datasetId] ??
                                NOT_AVAILABLE;
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
                                        onClick={() =>
                                          toggleDatasetExpansion(groupKey)
                                        }
                                        className="mr-2 font-semibold"
                                        aria-label={`Toggle dataset group ${datasetId}`}
                                      >
                                        {isExpanded ? "▼" : "▶"}
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDatasetClick(datasetId)
                                        }
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
                                      {renderCell(
                                        totals?.alleleCount,
                                        notAvailableLabel
                                      )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {renderCell(
                                        totals?.alleleNumber,
                                        notAvailableLabel
                                      )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {renderCell(
                                        totals?.alleleCountHomozygous,
                                        notAvailableLabel
                                      )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {renderCell(
                                        totals?.alleleCountHeterozygous,
                                        notAvailableLabel
                                      )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {renderCell(
                                        totals?.alleleCountHemizygous,
                                        notAvailableLabel
                                      )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {typeof totals?.alleleFrequency ===
                                      "number"
                                        ? totals.alleleFrequency.toFixed(4)
                                        : renderCell(
                                            undefined,
                                            notAvailableLabel
                                          )}
                                    </td>
                                    <td className="px-3 py-2 w-[220px] whitespace-nowrap">
                                      <div className="w-[220px]">
                                        <VariantAddToBasketButton
                                          datasetId={
                                            datasetId === NOT_AVAILABLE
                                              ? ""
                                              : datasetId
                                          }
                                          dataset={actionInfo?.dataset ?? null}
                                          isExternal={
                                            actionInfo?.isExternal ?? false
                                          }
                                          externalAccessUrl={
                                            actionInfo?.externalAccessUrl
                                          }
                                          disabled={
                                            datasetId === NOT_AVAILABLE ||
                                            (datasetId !== NOT_AVAILABLE &&
                                              !actionInfo)
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
                                          {renderCell(
                                            variant.alleleCount,
                                            notAvailableLabel
                                          )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                          {renderCell(
                                            variant.alleleNumber,
                                            notAvailableLabel
                                          )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                          {renderCell(
                                            variant.alleleCountHomozygous,
                                            notAvailableLabel
                                          )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                          {renderCell(
                                            variant.alleleCountHeterozygous,
                                            notAvailableLabel
                                          )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                          {renderCell(
                                            variant.alleleCountHemizygous,
                                            notAvailableLabel
                                          )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                          {variant.alleleFrequency != null
                                            ? variant.alleleFrequency.toFixed(4)
                                            : renderCell(
                                                undefined,
                                                notAvailableLabel
                                              )}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
