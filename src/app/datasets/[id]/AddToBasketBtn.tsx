// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/button";
import { Dataset } from "@/types/dataset.types";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";

type AddToBasketBtnProps = {
  dataset: Dataset;
};

function AddToBasketBtn({ dataset }: AddToBasketBtnProps) {
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
    <div className="flex w-1/3 lg:justify-end">
      {!isLoading && (
        <Button
          text={isInBasket ? "Remove from basket" : "Add to basket"}
          icon={isInBasket ? faMinusCircle : faPlusCircle}
          onClick={toggleDatasetInBasket}
          type={isInBasket ? "warning" : "primary"}
        />
      )}
    </div>
  );
}

export default AddToBasketBtn;
