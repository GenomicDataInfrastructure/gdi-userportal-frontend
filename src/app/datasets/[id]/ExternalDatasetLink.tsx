// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { ExternalDatasetDialogLink } from "@/components/ExternalDatasetCardLink";

type ExternalDatasetLinkProps = {
  url: string;
};

export default function ExternalDatasetLink({ url }: ExternalDatasetLinkProps) {
  return (
    <ExternalDatasetDialogLink url={url}>
      {({ onClick }) => (
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 text-xs rounded-md px-3 py-2 font-semibold bg-info text-white hover:bg-secondary transition-colors duration-200 w-fit"
        >
          <span>Access External Dataset</span>
          <span>→</span>
        </button>
      )}
    </ExternalDatasetDialogLink>
  );
}
