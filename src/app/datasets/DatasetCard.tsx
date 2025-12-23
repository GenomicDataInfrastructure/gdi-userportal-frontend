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
import {
  getFirstAccessUrl,
  getExternalDatasetInfo,
} from "@/utils/datasetHelpers";
import {
  faMinusCircle,
  faPlusCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card, { CardItem } from "../../components/Card";
import { useEffect, useState, useRef, useMemo } from "react";
import { ExternalDatasetConfirmationDialog } from "@/components/ExternalDatasetCardLink";

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
  const { basket, addDatasetToBasket, removeDatasetFromBasket, isLoading } =
    useDatasetBasket();

  const [conformsTo, setConformsTo] = useState<ValueLabel[] | undefined>(
    dataset.conformsTo
  );
  const [distributions, setDistributions] = useState(dataset.distributions);
  const hasFetchedRef = useRef(false);

  const { isExternal, label: externalLabel } = useMemo(
    () => getExternalDatasetInfo({ id: dataset.id, conformsTo } as SearchedDataset),
    [dataset.id, conformsTo]
  );

  useEffect(() => {
    if (dataset.id && !hasFetchedRef.current && (conformsTo === undefined || (isExternal && !distributions))) {
      hasFetchedRef.current = true;
      retrieveDatasetApi(dataset.id)
        .then((data) => {
          setConformsTo(data?.conformsTo);
          setDistributions(data?.distributions);
        })
        .catch(() => {
          hasFetchedRef.current = false;
        });
    }
  }, [dataset.id, conformsTo, isExternal]);

  const isInBasket = basket.some((ds) => ds.id === dataset.id);

  const toggleBasket = (e: React.MouseEvent) => {
    (isInBasket ? removeDatasetFromBasket : addDatasetToBasket)(dataset);
  };

  const subTitles = useMemo(
    () =>
      dataset.themes
        ?.map((theme) => theme.label)
        .filter((title): title is string => !!title),
    [dataset.themes]
  );

  const keywords = useMemo(
    () =>
      dataset.keywords
        ?.map((keyword) =>
          typeof keyword === "string" ? keyword : keyword.label
        )
        .filter((kw): kw is string => !!kw),
    [dataset.keywords]
  );

  const buttonElement = !displayBasketButton ? undefined : isExternal ? (
    getFirstAccessUrl(distributions) ? (
      <ExternalDatasetConfirmationDialog url={getFirstAccessUrl(distributions)!}>
        {({ onClick }) => (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClick(e);
            }}
            className="text-xs sm:text-base text-primary hover:text-info underline hover:no-underline font-semibold transition-colors duration-200 cursor-pointer shrink-0 inline-flex items-center gap-1"
          >
            <span>Access external dataset</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        )}
      </ExternalDatasetConfirmationDialog>
    ) : (
      <button disabled className="text-xs sm:text-base text-gray-400 cursor-not-allowed inline-flex items-center gap-1">
        <span>External link not available</span>
        <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
      </button>
    )
  ) : (
    <button
      onClick={toggleBasket}
      disabled={isLoading || !dataset.identifier}
      className={`text-xs sm:text-base rounded-md px-4 py-2 font-bold transition-colors duration-200 tracking-wide cursor-pointer shrink-0 ${
        (isLoading || !dataset.identifier) ? "opacity-60 cursor-not-allowed" : ""
      } ${
        isInBasket
          ? "bg-warning text-black hover:bg-secondary hover:text-white"
          : "bg-primary text-white hover:bg-secondary"
      }`}
    >
      <FontAwesomeIcon icon={isInBasket ? faMinusCircle : faPlusCircle} className="mr-2" />
      <span>{isInBasket ? "Remove from basket" : "Add to basket"}</span>
    </button>
  );

  return (
    <Card
      url={`/datasets/${dataset.id}`}
      title={dataset.title}
      subTitles={subTitles}
      description={
        dataset.description
          ? truncateDescription(dataset.description, screenSize)
          : "No description available"
      }
      cardItems={cardItems}
      keywords={keywords}
      externalUrl={isExternal ? getFirstAccessUrl(distributions) : undefined}
      button={buttonElement}
      isExternal={isExternal}
      externalLabel={externalLabel}
    />
  );
}

export default DatasetCard;
