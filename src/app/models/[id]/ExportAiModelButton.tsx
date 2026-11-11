// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { retrieveAiModelInSpecifiedFormat } from "@/app/api/discovery";
import ExportMetadataButton from "@/components/ExportMetadataButton";
import { ExportMetadataItem } from "@/components/ExportMetadataFormats";

type ExportAiModelButtonProps = {
  aiModelId: string;
  item: ExportMetadataItem;
};

export default function ExportAiModelButton({
  aiModelId,
  item,
}: ExportAiModelButtonProps) {
  return (
    <ExportMetadataButton
      id={aiModelId}
      item={item}
      retrieveInFormat={retrieveAiModelInSpecifiedFormat}
    />
  );
}
