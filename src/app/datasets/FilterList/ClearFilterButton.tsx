// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Button from "@/components/Button";
import { useFilters } from "@/providers/FilterProvider";

export default function ClearFilterButton() {
  const { clearActiveFilters } = useFilters();

  return (
    <div className="flex justify-end">
        <Button
          text="Clear Filters"
          type="warning"
          onClick={clearActiveFilters}
        />
    </div>
  );
}
