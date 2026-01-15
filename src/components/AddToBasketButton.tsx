// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/Button";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

type AddToBasketButtonProps = {
  dataset: SearchedDataset | null;
  disabled?: boolean;
};

function AddToBasketButton({
  dataset,
  disabled: isDisabledProp = false,
}: Readonly<AddToBasketButtonProps>) {
  const { basket, addDatasetToBasket, removeDatasetFromBasket, isLoading } =
    useDatasetBasket();

  const isInBasket = dataset
    ? basket.some((ds) => ds.id === dataset.id)
    : false;
  const buttonDisabled = isLoading || !dataset?.identifier || isDisabledProp;

  const toggleDatasetInBasket = () => {
    if (!dataset) return;
    if (isInBasket) removeDatasetFromBasket(dataset);
    else addDatasetToBasket(dataset);
  };

  return (
    <Button
      text={isInBasket ? "Remove from basket" : "Add to basket"}
      icon={isInBasket ? faMinusCircle : faPlusCircle}
      onClick={toggleDatasetInBasket}
      type={isInBasket ? "warning" : "primary"}
      disabled={buttonDisabled}
      className={`custom-button ${buttonDisabled ? "opacity-50" : ""}`}
    />
  );
}

export default AddToBasketButton;
