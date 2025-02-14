// SPDX-License-IdentifierText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import React from "react";
import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";
import { PopulationReverseMap } from "@/app/api/discovery/additional-types";

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
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Dataset</th>
            <th className="border border-gray-300 px-4 py-2">Population</th>
            <th className="border border-gray-300 px-4 py-2">Allele Count</th>
            <th className="border border-gray-300 px-4 py-2">Allele Number</th>
            <th className="border border-gray-300 px-4 py-2">Homozygous</th>
            <th className="border border-gray-300 px-4 py-2">Heterozygous</th>
            <th className="border border-gray-300 px-4 py-2">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByBeacon).map(([beacon, variants]) => (
            <React.Fragment key={beacon}>
              <tr className="bg-gray-300">
                <td colSpan={7} className="text-left font-semibold px-4 py-2">
                  Beacon: {beacon}
                </td>
              </tr>
              {variants.map((variant, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.dataset}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {PopulationReverseMap[variant.population ?? "lux"]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.alleleCount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.alleleNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.alleleCountHomozygous}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {variant.alleleCountHeterozygous}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
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
