// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useWindowSize } from "@/hooks";
import { truncateDescription } from "@/utils/textProcessing";
import Link from "next/link";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/button";
import Chips from "./Chips";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";

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
  const { basket, addDatasetToBasket, removeDatasetFromBasket } =
    useDatasetBasket();
  const isInBasket = basket.some((dataset) => dataset.id === id);
  const dataset = {
    id,
    title,
    publicationDate,
    catalogue,
    description,
    themes,
  };
  const toggleDatasetInBasket = () => {
    if (isInBasket) {
      removeDatasetFromBasket(dataset);
    } else {
      addDatasetToBasket(dataset);
    }
  };

  return (
    <div className="box break-words rounded-lg border bg-white-smoke p-8">
      <Link href={`/datasets/${id}`} className="hover:underline">
        <div className="mb-4 flex justify-between">
          <h3 className="text-xl text-info md:text-2xl">{title}</h3>
          <p className="text-sm text-info md:text-base">
            {publicationDate?.split("T")[0]}
          </p>
        </div>
      </Link>
      <p className="mb-4 text-sm text-info md:text-base">{catalogue}</p>
      <p className="mb-4 text-xs md:text-sm">{truncatedDesc}</p>
      <Chips
        chips={themes}
        className="break-all bg-warning text-xs text-black md:text-sm"
      />
      <div className="w-fulln flex justify-end">
        <Button
          text={isInBasket ? "Remove from basket" : "Add to basket"}
          icon={isInBasket ? faMinusCircle : faPlusCircle}
          onClick={toggleDatasetInBasket}
          type={isInBasket ? "warning" : "primary"}
        />
      </div>
    </div>
  );
}

export default DatasetItem;
