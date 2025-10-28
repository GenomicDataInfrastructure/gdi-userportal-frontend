// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { retrieveDatasetInSpecifiedFormat } from "../../api/discovery";
import Button from "@/components/Button";

type ExportDatasetButtonProps = {
  datasetId: string;
  item: { format: string; label: string; style: Record<string, unknown> };
};

export default function ExportDatasetButton({
  datasetId,
  item,
}: ExportDatasetButtonProps) {
  const handleDatasetExport = async (datasetId: string, format: string) => {
    try {
      const data = (await retrieveDatasetInSpecifiedFormat(
        datasetId,
        format as "rdf" | "ttl" | "jsonld"
      )) as unknown as BlobPart;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${datasetId}.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={item.style} className="rounded-lg px-1 transition">
      <Button
        className="flex items-center text-sm font-normal"
        text={`${item.label}`}
        onClick={() => handleDatasetExport(datasetId, item.format)}
      />
    </div>
  );
}
