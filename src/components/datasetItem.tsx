// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useWindowSize } from "@/hooks";
import { truncateDescription } from "@/utils/textProcessing";
import Link from "next/link";
import Chips from "./Chips";

type DatasetItemProps = {
  id: string;
  title: string;
  publicationDate: string;
  catalogue: string;
  description: string;
  themes: string[];
};

function DatasetItem({
  id,
  title,
  publicationDate,
  catalogue,
  description,
  themes,
}: DatasetItemProps) {
  const { width: screenWidth } = useWindowSize();
  const truncatedDesc = truncateDescription(description, screenWidth);

  return (
    <div className="box break-words rounded-lg border bg-white-smoke p-8 duration-200 hover:border-info hover:shadow-md hover:ring-offset-1">
      <Link href={`/datasets/${id}`}>
        <div className="mb-4 flex justify-between">
          <h3 className="text-xl text-info md:text-2xl">{title}</h3>
          <p className="text-sm text-info md:text-base">
            {publicationDate?.split("T")[0]}
          </p>
        </div>
        <p className="mb-4 text-sm text-info md:text-base">{catalogue}</p>
        <p className="mb-4 text-xs md:text-sm">{truncatedDesc}</p>
        <Chips
          chips={themes}
          className="break-all bg-warning text-xs text-black md:text-sm"
        />
      </Link>
    </div>
  );
}

export default DatasetItem;
