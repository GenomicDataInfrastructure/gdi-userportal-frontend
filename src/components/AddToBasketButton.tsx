// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/Button";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

type AddToBasketButtonProps = {
  dataset: SearchedDataset;
};

function AddToBasketButton({ dataset }: Readonly<AddToBasketButtonProps>) {
  const { basket, addDatasetToBasket, removeDatasetFromBasket, isLoading } =
    useDatasetBasket();

  const isInBasket = basket.some((ds) => ds.id === dataset.id);
  const toggleDatasetInBasket = () => {
    console.log(
      "Dataset ID:",
      dataset.id,
      "Is in basket:",
      isInBasket,
      dataset
    );
    if (isInBasket) {
      removeDatasetFromBasket(dataset);
    } else {
      addDatasetToBasket(dataset);
    }
  };

  const hasIdentifier = !!dataset.identifier;
  const buttonDisabled = isLoading || !hasIdentifier;

  return (
    <Button
      text={isInBasket ? "Remove from basket" : "Add to basket"}
      icon={isInBasket ? faMinusCircle : faPlusCircle}
      onClick={toggleDatasetInBasket}
      type={isInBasket ? "warning" : "primary"}
      disabled={buttonDisabled}
      className="custom-button"
    />
  );
}

export default AddToBasketButton;
