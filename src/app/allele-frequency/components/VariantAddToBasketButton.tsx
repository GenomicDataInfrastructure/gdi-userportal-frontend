// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import React from "react";
import AddToBasketButton from "@/components/AddToBasketButton";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";
import { ExternalDatasetConfirmationDialog } from "@/components/ExternalDatasetCardLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type VariantAddToBasketButtonProps = {
  datasetId: string;
  dataset: SearchedDataset | null;
  isExternal: boolean;
  externalAccessUrl?: string;
  disabled?: boolean;
};

export default function VariantAddToBasketButton({
  datasetId,
  dataset,
  isExternal,
  externalAccessUrl,
  disabled = false,
}: VariantAddToBasketButtonProps) {
  if (isExternal) {
    if (externalAccessUrl) {
      return (
        <ExternalDatasetConfirmationDialog url={externalAccessUrl}>
          {({ onClick }) => (
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClick(event);
              }}
              className="text-sm text-primary hover:text-info underline hover:no-underline font-semibold transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
            >
              <span>Access external dataset</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
          )}
        </ExternalDatasetConfirmationDialog>
      );
    }

    return (
      <span className="text-sm text-gray-400 cursor-not-allowed">
        External link not available
      </span>
    );
  }

  return (
    <AddToBasketButton
      dataset={dataset}
      disabled={disabled || !datasetId || !dataset}
    />
  );
}
