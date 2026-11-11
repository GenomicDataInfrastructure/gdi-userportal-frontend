// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { retrieveDatasetInSpecifiedFormat } from "../../api/discovery";
import ExportMetadataButton from "@/components/ExportMetadataButton";
import { ExportMetadataItem } from "@/components/ExportMetadataFormats";

type ExportDatasetButtonProps = {
  datasetId: string;
  item: ExportMetadataItem;
};

export default function ExportDatasetButton({
  datasetId,
  item,
}: ExportDatasetButtonProps) {
  return (
    <ExportMetadataButton
      id={datasetId}
      item={item}
      retrieveInFormat={retrieveDatasetInSpecifiedFormat}
    />
  );
}
