// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { PopulationReverseMap } from "@/app/api/discovery/additional-types";
import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";
import React from "react";

type GVariantsTableProps = {
  results: GVariantsSearchResponse[];
};

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

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-surface shadow-lg rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-primary text-surface">
            <th className="px-6 py-4 text-left">Dataset</th>
            <th className="px-6 py-4 text-left">Population</th>
            <th className="px-6 py-4 text-left">Allele Count</th>
            <th className="px-6 py-4 text-left">Allele Number</th>
            <th className="px-6 py-4 text-left">Homozygous</th>
            <th className="px-6 py-4 text-left">Heterozygous</th>
            <th className="px-6 py-4 text-left">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByBeacon).map(([beacon, variants]) => (
            <React.Fragment key={beacon}>
              <tr className="bg-[#70154C14] border border-secondary">
                <td colSpan={7} className="px-6 py-4 text-lg font-bold">
                  Beacon: {beacon}
                </td>
              </tr>
              {variants.map((variant, index) => (
                <tr key={index} className="border-t border-surface bg-surface">
                  <td className="px-6 py-4">{variant.dataset}</td>
                  <td className="px-6 py-4">
                    {PopulationReverseMap[variant.population ?? "lux"]}
                  </td>
                  <td className="px-6 py-4">{variant.alleleCount}</td>
                  <td className="px-6 py-4">{variant.alleleNumber}</td>
                  <td className="px-6 py-4">{variant.alleleCountHomozygous}</td>
                  <td className="px-6 py-4">
                    {variant.alleleCountHeterozygous}
                  </td>
                  <td className="px-6 py-4">
                    {variant.alleleFrequency?.toFixed(4)}
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
