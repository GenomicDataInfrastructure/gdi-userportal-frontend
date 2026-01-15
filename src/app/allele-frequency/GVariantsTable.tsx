// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";
import VariantAddToBasketButton from "./components/VariantAddToBasketButton";
import { findDatasetByIdentifier } from "@/utils/datasetEntitlements";
import React from "react";

type GVariantsTableProps = {
  results: GVariantsSearchResponse[];
};

const renderCell = (value: any) =>
  value != null ? (
    value
  ) : (
    <span className="text-xs text-gray-400">not available</span>
  );

export default function GVariantsTable({ results }: GVariantsTableProps) {
  const groupedByBeacon = results.reduce(
    (acc, variant) => {
      if (!variant.beacon) {
        return acc;
      }
      if (!acc[variant.beacon]) {
        acc[variant.beacon] = [];
      }
      acc[variant.beacon].push(variant);
      return acc;
    },
    {} as Record<string, GVariantsSearchResponse[]>
  );

  const handleDatasetClick = async (identifier: string) => {
    const dataset = await findDatasetByIdentifier(identifier);
    if (dataset?.id) {
      window.open(`/datasets/${dataset.id}`, "_blank");
    } else {
      console.warn(`Dataset not found for identifier: ${identifier}`);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-surface shadow-lg rounded-xl overflow-hidden">
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
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByBeacon).map(([beacon, variants]) => (
            <React.Fragment key={beacon}>
              <tr className="bg-[#70154C14] border border-secondary">
                <td colSpan={9} className="px-3 py-2 text-lg font-bold">
                  Beacon: {beacon}
                </td>
              </tr>
              {variants.map((variant, index) => (
                <tr key={index} className="border-t border-surface bg-surface">
                  <td className="px-3 py-2">
                    <button
                      onClick={() =>
                        variant.datasetId &&
                        handleDatasetClick(variant.datasetId as string)
                      }
                      disabled={!variant.datasetId}
                      className={`underline transition-colors ${
                        variant.datasetId
                          ? "text-primary hover:text-secondary hover:no-underline cursor-pointer"
                          : "text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {variant.datasetId || "not available"}
                    </button>
                  </td>
                  <td className="px-3 py-2">{variant.population || "-"}</td>
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
                  <td className="px-3 py-2">
                    <VariantAddToBasketButton
                      datasetId={(variant.datasetId as string) || ""}
                    />
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
