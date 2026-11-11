// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Button from "@/components/Button";
import {
  ExportMetadataFormat,
  ExportMetadataItem,
} from "@/components/ExportMetadataFormats";

export type { ExportMetadataFormat, ExportMetadataItem };

type ExportMetadataButtonProps = {
  id: string;
  item: ExportMetadataItem;
  retrieveInFormat: (id: string, format: ExportMetadataFormat) => Promise<Blob>;
};

export default function ExportMetadataButton({
  id,
  item,
  retrieveInFormat,
}: ExportMetadataButtonProps) {
  const handleExport = async () => {
    try {
      const data = (await retrieveInFormat(
        id,
        item.format
      )) as unknown as BlobPart;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${id}.${item.format}`);
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
        onClick={handleExport}
      />
    </div>
  );
}
