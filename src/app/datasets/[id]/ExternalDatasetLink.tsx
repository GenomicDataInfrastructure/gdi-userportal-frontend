// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { ExternalDatasetConfirmationDialog } from "@/components/ExternalDatasetCardLink";
import { useTranslations } from "next-intl";

type ExternalDatasetLinkProps = {
  url: string;
};

export default function ExternalDatasetLink({ url }: ExternalDatasetLinkProps) {
  const t = useTranslations("datasets.detail");

  return (
    <ExternalDatasetConfirmationDialog url={url}>
      {({ onClick }) => (
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 text-xs rounded-md px-3 py-2 font-semibold bg-info text-white hover:bg-secondary transition-colors duration-200 w-fit"
        >
          <span>{t("accessExternalDataset")}</span>
          <span>→</span>
        </button>
      )}
    </ExternalDatasetConfirmationDialog>
  );
}
