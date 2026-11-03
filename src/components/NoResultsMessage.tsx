// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";

type NoResultsMessageProps = {
  namespace: string;
  count?: number;
  isLoading: boolean;
  /** Only show the message once the user has narrowed results somehow. Omit to always show on a zero count. */
  hasAppliedFilters?: boolean;
};

export default function NoResultsMessage({
  namespace,
  count,
  isLoading,
  hasAppliedFilters = true,
}: Readonly<NoResultsMessageProps>) {
  const t = useTranslations(namespace);

  if (isLoading || count !== 0 || !hasAppliedFilters) {
    return null;
  }

  return (
    <div className="text-center py-8 mt-4">
      <p className="text-lg text-primary mb-4">{t("noResults")}</p>
    </div>
  );
}
