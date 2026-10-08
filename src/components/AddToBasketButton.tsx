// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/Button";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import {
  faCheckCircle,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

type AddToBasketButtonProps = {
  dataset: SearchedDataset | null;
  disabled?: boolean;
  withoutAccessContent?: ReactNode;
  layout?: "stacked" | "inline";
};

function AddToBasketButton({
  dataset,
  disabled: isDisabledProp = false,
  withoutAccessContent,
  layout = "stacked",
}: Readonly<AddToBasketButtonProps>) {
  const t = useTranslations("basket");
  const {
    basket,
    addDatasetToBasket,
    removeDatasetFromBasket,
    isLoading,
    hasDatasetAccess,
    isAccessLoading,
  } = useDatasetBasket();

  const isInBasket = dataset
    ? basket.some((ds) => ds.id === dataset.id)
    : false;
  const hasAccess = !!dataset && hasDatasetAccess(dataset);
  const buttonDisabled =
    hasAccess ||
    isAccessLoading ||
    isLoading ||
    !dataset?.identifier ||
    isDisabledProp;

  const toggleDatasetInBasket = () => {
    if (!dataset) return;
    if (isInBasket) removeDatasetFromBasket(dataset);
    else addDatasetToBasket(dataset);
  };

  return (
    <div
      className={
        layout === "inline"
          ? "flex flex-wrap items-center justify-end gap-x-4 gap-y-2"
          : "flex flex-col items-start gap-2"
      }
    >
      {withoutAccessContent}
      <span role="status" aria-atomic="true">
        {hasAccess && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-primary"
              aria-hidden="true"
            />
            <span>{t("accessGranted")}</span>
            <span className="sr-only">: {dataset?.title}</span>
          </span>
        )}
      </span>
      {!hasAccess && !withoutAccessContent && (
        <Button
          text={isInBasket ? t("removeFromBasket") : t("addToBasket")}
          icon={isInBasket ? faMinusCircle : faPlusCircle}
          onClick={toggleDatasetInBasket}
          type={isInBasket ? "warning" : "primary"}
          disabled={buttonDisabled}
          className={`custom-button min-h-10 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${buttonDisabled ? "opacity-50" : ""}`}
        />
      )}
    </div>
  );
}

export default AddToBasketButton;
