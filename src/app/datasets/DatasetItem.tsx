// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/Button";
import Chips from "@/components/Chips";
import { useWindowSize } from "@/hooks";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import { formatDate } from "@/utils/formatDate";
import { truncateDescription } from "@/utils/textProcessing";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type DatasetItemProps = {
  dataset: SearchedDataset;
};

function DatasetItem({ dataset }: DatasetItemProps) {
  const { width: screenWidth } = useWindowSize();
  const truncatedDesc = dataset.description
    ? truncateDescription(dataset.description, screenWidth)
    : null;
  const { basket, addDatasetToBasket, removeDatasetFromBasket, isLoading } =
    useDatasetBasket();
  const isInBasket = basket.some((ds) => ds.id === dataset.id);
  const toggleDatasetInBasket = () => {
    if (isInBasket) {
      removeDatasetFromBasket(dataset);
    } else {
      addDatasetToBasket(dataset);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Link href={`/datasets/${dataset.id}`} className="hover:underline">
          <h3 className="text-xl text-primary md:text-2xl">{dataset.title}</h3>
        </Link>
        <p className="text-sm text-info md:text-base">
          {formatDate(dataset.createdAt)}
        </p>
      </div>
      <p className="mb-4 text-sm text-info md:text-base">{dataset.catalogue}</p>
      {truncatedDesc && (
        <p className="mb-4 text-xs md:text-sm">{truncatedDesc}</p>
      )}
      <Chips chips={dataset.themes?.map((x) => x.label) || []} />
      <div
        className={
          "mt-4 flex w-full " +
          (!!dataset.recordsCount ? "justify-between" : "justify-end")
        }
      >
        {!!dataset.recordsCount && (
          <span className="mt-4 flex rounded bg-info px-2 py-1 text-xs font-bold text-white">
            {dataset.recordsCount} record{dataset.recordsCount > 1 ? "s" : ""}{" "}
            found
          </span>
        )}
        {!isLoading && (
          <Button
            text={isInBasket ? "Remove from basket" : "Add to basket"}
            icon={isInBasket ? faMinusCircle : faPlusCircle}
            onClick={toggleDatasetInBasket}
            type={isInBasket ? "warning" : "primary"}
          />
        )}
      </div>
    </>
  );
}

export default DatasetItem;
