// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Button from "@/components/Button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ClearFilterButtonProps = {
  facetGroups: string[];
};

export default function ClearFilterButton({
  facetGroups,
}: ClearFilterButtonProps) {
  const queryParams = useSearchParams();

  useEffect(() => {}, [queryParams]);

  function isAnyGroupFilterApplied() {
    if (!queryParams) return false;
    return Array.from(queryParams.keys()).some(
      (key) =>
        key !== "page" &&
        key !== "q" &&
        facetGroups.some((group) => key.includes(group))
    );
  }
  function getQueryStringWithoutGroupFilter() {
    const filteredParamsQuery = Array.from(queryParams.keys())
      .filter(
        (x) => facetGroups.every((group) => !x.includes(group)) && x !== "page"
      )
      .map((x) => `&${x}=${queryParams.get(x)}`)
      .join("");

    return filteredParamsQuery;
  }

  return (
    <div className="mt-4 flex justify-end">
      {isAnyGroupFilterApplied() && (
        <Button
          href={`/datasets?page=1${getQueryStringWithoutGroupFilter()}`}
          text="Clear Filters"
          type="warning"
        />
      )}
    </div>
  );
}
