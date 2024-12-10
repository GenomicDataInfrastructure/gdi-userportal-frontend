// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@/components/Button";
import { useWindowSize } from "@/hooks";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { truncateDescription } from "@/utils/textProcessing";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Card, { CardItem } from "../../components/Card";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

type DatasetCardProps = {
  dataset: SearchedDataset;
  cardItems: CardItem[];
  displayBasketButton?: boolean;
};

function DatasetCard({
  dataset,
  cardItems,
  displayBasketButton = true,
}: Readonly<DatasetCardProps>) {
  const screenSize = useWindowSize();
  const truncatedDesc = dataset.description
    ? truncateDescription(dataset.description, screenSize)
    : null;

  const { basket, addDatasetToBasket, removeDatasetFromBasket, isLoading } =
    useDatasetBasket();

  const isInBasket = basket.some((ds) => ds.id === dataset.id);

  const toggleDatasetInBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInBasket) {
      removeDatasetFromBasket(dataset);
    } else {
      addDatasetToBasket(dataset);
    }
  };

  const hasIdentifier = !!dataset.identifier;
  const buttonDisabled = isLoading || !hasIdentifier;

  return (
    <Card
      url={`/datasets/${dataset.id}`}
      title={dataset.title}
      subTitles={dataset.themes?.map((theme) => theme.label)}
      description={truncatedDesc || "No description available"}
      cardItems={cardItems}
      keywords={dataset.keywords?.map((keyword) => keyword.label)}
      button={
        displayBasketButton && (
          <Button
            text={isInBasket ? "Remove from basket" : "Add to basket"}
            icon={isInBasket ? faMinusCircle : faPlusCircle}
            onClick={toggleDatasetInBasket}
            type={isInBasket ? "warning" : "primary"}
            disabled={buttonDisabled}
            flex={true}
            className="text-xs sm:text-base"
          />
        )
      }
    />
  );
}

export default DatasetCard;
