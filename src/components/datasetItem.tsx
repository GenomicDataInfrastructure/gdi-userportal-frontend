// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { useWindowSize } from "@/hooks";
import { truncateDescription } from "@/utils/textTransformation";
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
    <li className="rounded-lg border bg-white-smoke p-8 duration-200 hover:border-info hover:shadow-md hover:ring-offset-1">
      <Link href={`/dataset/${id}`}>
        <div className="mb-4 flex justify-between">
          <h3 className="text-2xl text-info">{title}</h3>
          <p className="text-md text-info">{publicationDate}</p>
        </div>
        <p className="mb-4 text-info">{catalogue}</p>
        <p className="mb-4 text-sm">{truncatedDesc}</p>
        <Chips chips={themes} className="bg-warning text-black" />
      </Link>
    </li>
  );
}

export default DatasetItem;
