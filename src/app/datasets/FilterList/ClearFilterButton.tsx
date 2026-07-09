// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Button from "@/components/Button";
import { useFilters } from "@/providers/filters/FilterProvider";
import { useTranslations } from "next-intl";

export default function ClearFilterButton() {
  const t = useTranslations("datasets.filters");
  const { clearActiveFilters } = useFilters();

  return (
    <div className="flex justify-end">
      <Button
        text={t("clearFilters")}
        type="warning"
        onClick={clearActiveFilters}
      />
    </div>
  );
}
