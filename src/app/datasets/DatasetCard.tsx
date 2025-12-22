// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  SearchedDataset,
  ValueLabel,
} from "@/app/api/discovery/open-api/schemas";
import { retrieveDatasetApi } from "@/app/api/discovery";
import { useWindowSize } from "@/hooks";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { truncateDescription } from "@/utils/textProcessing";
import { isExternalDataset, getFirstAccessUrl } from "@/utils/datasetHelpers";
import {
  faMinusCircle,
  faPlusCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card, { CardItem } from "../../components/Card";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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

  const [conformsTo, setConformsTo] = useState<ValueLabel[] | undefined>(
    undefined
  );
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (dataset.id && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      retrieveDatasetApi(dataset.id)
        .then((fullDataset) => {
          setConformsTo(fullDataset?.conformsTo);
        })
        .catch(() => {
          setConformsTo(undefined);
        });
    }
  }, [dataset.id]);

  const datasetWithConformsTo = {
    ...dataset,
    conformsTo: conformsTo,
  };
  const isInBasket = basket.some((ds) => ds.id === dataset.id);
  const isExternal = isExternalDataset(datasetWithConformsTo);
  const externalAccessUrl = getFirstAccessUrl(dataset.distributions);

  const toggleDatasetInBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    (isInBasket ? removeDatasetFromBasket : addDatasetToBasket)(dataset);
  };

  const hasIdentifier = !!dataset.identifier;
  const buttonDisabled = isLoading || !hasIdentifier;

  const renderButton = () => {
    if (!displayBasketButton) return undefined;

    if (isExternal) {
      return (
        <Link
          href={`/datasets/${dataset.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs sm:text-base text-primary hover:text-info underline hover:no-underline font-semibold transition-colors duration-200 cursor-pointer shrink-0 inline-flex items-center gap-1"
        >
          <span>View dataset details</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </Link>
      );
    }

    return (
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (buttonDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          toggleDatasetInBasket(e);
        }}
        disabled={buttonDisabled}
        className={`text-xs sm:text-base rounded-md px-4 py-2 font-bold transition-colors duration-200 tracking-wide cursor-pointer shrink-0 ${buttonDisabled ? "opacity-60 cursor-not-allowed" : ""} ${isInBasket ? "bg-warning text-black hover:bg-secondary hover:text-white" : "bg-primary text-white hover:bg-secondary"}`}
      >
        <FontAwesomeIcon
          icon={isInBasket ? faMinusCircle : faPlusCircle}
          className="mr-2"
        />
        <span>{isInBasket ? "Remove from basket" : "Add to basket"}</span>
      </button>
    );
  };

  return (
    <Card
      url={`/datasets/${dataset.id}`}
      title={dataset.title}
      subTitles={dataset.themes
        ?.map((theme) => theme.label || theme.display_name)
        .filter((title): title is string => !!title)}
      description={truncatedDesc || "No description available"}
      cardItems={cardItems}
      keywords={dataset.keywords
        ?.map((keyword) =>
          typeof keyword === "string"
            ? keyword
            : keyword.label || keyword.display_name
        )
        .filter((kw): kw is string => !!kw)}
      externalUrl={isExternal ? externalAccessUrl : undefined}
      button={renderButton()}
      isExternal={isExternal}
    />
  );
}

export default DatasetCard;
