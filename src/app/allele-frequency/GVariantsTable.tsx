// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";
import VariantAddToBasketButton from "./components/VariantAddToBasketButton";
import { findDatasetByIdentifier } from "@/utils/datasetEntitlements";
import { useRouter } from "next/navigation";
import React from "react";

type GVariantsTableProps = {
  results: GVariantsSearchResponse[];
};

export default function GVariantsTable({ results }: GVariantsTableProps) {
  const router = useRouter();
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
      router.push(`/datasets/${dataset.id}`);
    } else {
      console.warn(`Dataset not found for identifier: ${identifier}`);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-surface shadow-lg rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-primary text-surface">
            <th className="px-6 py-4 text-left">Dataset</th>
            <th className="px-6 py-4 text-left">Population</th>
            <th className="px-6 py-4 text-left">Allele Count</th>
            <th className="px-6 py-4 text-left">Allele Number</th>
            <th className="px-6 py-4 text-left">Homozygous</th>
            <th className="px-6 py-4 text-left">Heterozygous</th>
            <th className="px-6 py-4 text-left">Hemizygous</th>
            <th className="px-6 py-4 text-left">Frequency</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByBeacon).map(([beacon, variants]) => (
            <React.Fragment key={beacon}>
              <tr className="bg-[#70154C14] border border-secondary">
                <td colSpan={9} className="px-6 py-4 text-lg font-bold">
                  Beacon: {beacon}
                </td>
              </tr>
              {variants.map((variant, index) => (
                <tr key={index} className="border-t border-surface bg-surface">
                  <td className="px-6 py-4">
                    {variant.datasetId ? (
                      <button
                        onClick={() => handleDatasetClick(variant.datasetId!)}
                        className="text-primary hover:text-secondary underline hover:no-underline transition-colors cursor-pointer"
                      >
                        {variant.datasetId}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4">{variant.population || "-"}</td>
                  <td className="px-6 py-4">{variant.alleleCount}</td>
                  <td className="px-6 py-4">{variant.alleleNumber}</td>
                  <td className="px-6 py-4">{variant.alleleCountHomozygous}</td>
                  <td className="px-6 py-4">
                    {variant.alleleCountHeterozygous}
                  </td>
                  <td className="px-6 py-4">{variant.alleleCountHemizygous}</td>
                  <td className="px-6 py-4">
                    {variant.alleleFrequency?.toFixed(4)}
                  </td>
                  <td className="px-6 py-4">
                    <VariantAddToBasketButton
                      datasetId={variant.datasetId || ""}
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
