// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import Chips from "@/components/Chips";
import { useWindowSize } from "@/hooks";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import { formatDate } from "@/utils/formatDate";
import { truncateDescription } from "@/utils/textProcessing";
import Link from "next/link";

type EntitlementCardProps = {
  dataset: SearchedDataset;
  start?: string;
  end?: string;
};

function EntitlementCard({
  dataset,
  start,
  end,
}: Readonly<EntitlementCardProps>) {
  const screenSize = useWindowSize();
  const truncatedDesc = dataset.description
    ? truncateDescription(dataset.description, screenSize)
    : null;

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Link href={`/datasets/${dataset.id}`} className="hover:underline">
          <h3 className="text-xl text-primary md:text-2xl">{dataset.title}</h3>
        </Link>
        <>
          <p className="font-date text-sm text-info md:text-base">
            <span className="text-primary">Start: </span>
            {!start ? "-" : formatDate(start)}
          </p>
          <p className="font-date text-sm text-info md:text-base">
            <span className="text-primary">End: </span>
            {!end ? "-" : formatDate(end)}
          </p>
        </>
        <p className="font-date text-sm text-info md:text-base">
          {formatDate(dataset.createdAt)}
        </p>
      </div>

      <p className="mb-4 text-sm text-info md:text-base">{dataset.catalogue}</p>
      {truncatedDesc && (
        <p className="mb-4 text-xs md:text-sm">{truncatedDesc}</p>
      )}
      <Chips chips={dataset.themes?.map((x) => x.label) || []} />
    </>
  );
}

export default EntitlementCard;
