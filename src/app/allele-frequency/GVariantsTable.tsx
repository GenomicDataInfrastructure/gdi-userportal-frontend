// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import {
  parsePopulationName,
  formatPopulationDisplay,
} from "@/app/api/discovery/additional-types";
import { GVariantsSearchResponse } from "@/app/api/discovery/open-api/schemas";
import { retrieveDatasetApi } from "@/app/api/discovery";
import AddToBasketButton from "@/components/AddToBasketButton";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

type GVariantsTableProps = {
  results: GVariantsSearchResponse[];
};

function DatasetActionCell({ datasetId }: { datasetId: string }) {
  const [dataset, setDataset] = useState<SearchedDataset | null>(null);
  const [notFound, setNotFound] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current || !datasetId) return;

    hasFetchedRef.current = true;
    retrieveDatasetApi(datasetId)
      .then((data) => {
        setDataset(data as SearchedDataset);
      })
      .catch((error) => {
        console.error("Failed to retrieve dataset", error);
        setNotFound(true);
      });
  }, [datasetId]);

  if (notFound) {
    return (
      <span className="text-xs text-gray-500" title="Dataset not available">
        Not available
      </span>
    );
  }

  if (!dataset) return null;
  return <AddToBasketButton dataset={dataset} />;
}

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
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByBeacon).map(([beacon, variants]) => (
            <React.Fragment key={beacon}>
              <tr className="bg-[#70154C14] border border-secondary">
                <td colSpan={8} className="px-6 py-4 text-lg font-bold">
                  Beacon: {beacon}
                </td>
              </tr>
              {variants.map((variant) => (
                <tr
                  key={`${beacon}-${variant.dataset}-${variant.population}`}
                  className="border-t border-surface bg-surface"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/datasets/${variant.dataset}`}
                      className="text-primary hover:underline hover:text-primary-dark transition-colors"
                    >
                      {variant.dataset}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {formatPopulationDisplay(
                      variant.population ?? "lux",
                      parsePopulationName(variant.population ?? "lux")
                    )}
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
                  <td className="px-6 py-4 flex justify-center">
                    {variant.dataset && (
                      <DatasetActionCell datasetId={variant.dataset} />
                    )}
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
